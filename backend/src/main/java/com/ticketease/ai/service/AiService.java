package com.ticketease.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketease.ai.client.GroqClient;
import com.ticketease.ai.config.AiProperties;
import com.ticketease.ai.dto.ChatRequest;
import com.ticketease.ai.dto.ChatResponse;
import com.ticketease.ai.dto.ProviderChatRequest;
import com.ticketease.ai.dto.ProviderChatResponse;
import com.ticketease.ai.dto.StructuredTripInformation;
import com.ticketease.ai.prompts.TicketEasePrompt;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class AiService {
    private final GroqClient groqClient;
    private final AiProperties properties;
    private final ObjectMapper objectMapper;
    private final ConcurrentHashMap<String, List<ProviderChatRequest.ProviderMessage>> conversations =
            new ConcurrentHashMap<>();

    public AiService(GroqClient groqClient, AiProperties properties, ObjectMapper objectMapper) {
        this.groqClient = groqClient;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    public Mono<ChatResponse> chat(ChatRequest request, String correlationId) {
        String conversationId = request.conversationId() == null || request.conversationId().isBlank()
                ? UUID.randomUUID().toString() : request.conversationId();
        List<ProviderChatRequest.ProviderMessage> history =
                conversations.computeIfAbsent(conversationId, ignored -> new ArrayList<>());
        synchronized (history) {
            history.add(new ProviderChatRequest.ProviderMessage("user", request.message()));
            List<ProviderChatRequest.ProviderMessage> messages = new ArrayList<>();
            messages.add(new ProviderChatRequest.ProviderMessage("system", TicketEasePrompt.systemInstructions()));
            messages.addAll(history);
            if (request.tripContext() != null && !request.tripContext().isNull()) {
                messages.add(new ProviderChatRequest.ProviderMessage(
                        "system", "Current trip context (treat as user-provided, not verified): "
                                + request.tripContext()));
            }
            ProviderChatRequest providerRequest = new ProviderChatRequest(properties.getModel(), messages, 0.2);
            return groqClient.isModelAvailable().flatMap(modelAvailable -> {
                if (!modelAvailable) {
                    return Mono.error(new AiProviderException(
                            "Configured AI model is unavailable at the provider", 503,
                            "provider_model_unavailable", correlationId, null,
                            "Configured model is not present in the provider model list"));
                }
                return groqClient.complete(providerRequest, correlationId);
            })
                    .map(providerResponse -> toResponse(conversationId, request.language(), history, providerResponse));
        }
    }

    public Mono<Status> status() {
        return groqClient.isReachable()
                .flatMap(reachable -> reachable
                        ? groqClient.isModelAvailable().map(modelAvailable ->
                                new Status(properties.isConfigured(), true, modelAvailable, properties.getModel()))
                        : Mono.just(new Status(properties.isConfigured(), false, false, properties.getModel())));
    }

    private ChatResponse toResponse(String id, String language,
            List<ProviderChatRequest.ProviderMessage> history, ProviderChatResponse response) {
        if (response == null || response.choices() == null || response.choices().isEmpty()
                || response.choices().get(0).message() == null
                || response.choices().get(0).message().content() == null) {
            throw new AiProviderException("AI provider returned no message", 502, "provider_empty_response");
        }
        String content = response.choices().get(0).message().content();
        ParsedAssistantResponse parsed = parseAssistantResponse(content);
        synchronized (history) {
            history.add(new ProviderChatRequest.ProviderMessage("assistant", parsed.message()));
        }
        return new ChatResponse(id, parsed.message(), language, parsed.suggestedActions(),
                parsed.structuredTripInformation());
    }

    public record Status(boolean configured, boolean reachable, boolean modelAvailable, String model) {}

    private ParsedAssistantResponse parseAssistantResponse(String content) {
        try {
            String json = content.trim();
            int start = json.indexOf('{');
            int end = json.lastIndexOf('}');
            if (start < 0 || end <= start) {
                return fallback(content);
            }
            JsonNode root = objectMapper.readTree(json.substring(start, end + 1));
            String message = root.path("message").isTextual()
                    ? root.path("message").asText() : content;
            List<String> actions = new ArrayList<>();
            JsonNode actionNode = root.path("suggestedActions");
            if (actionNode.isArray()) {
                actionNode.forEach(action -> {
                    if (action.isTextual()) {
                        actions.add(action.asText());
                    }
                });
            }
            StructuredTripInformation trip = root.has("structuredTripInformation")
                    && !root.get("structuredTripInformation").isNull()
                    ? objectMapper.treeToValue(root.get("structuredTripInformation"),
                            StructuredTripInformation.class) : null;
            return new ParsedAssistantResponse(message, actions, trip);
        } catch (Exception ignored) {
            return fallback(content);
        }
    }

    private ParsedAssistantResponse fallback(String content) {
        return new ParsedAssistantResponse(content, List.of(
                "Refine the trip plan", "Compare options", "Ask about Kannada support"), null);
    }

    private record ParsedAssistantResponse(
            String message, List<String> suggestedActions,
            StructuredTripInformation structuredTripInformation) {}
}
