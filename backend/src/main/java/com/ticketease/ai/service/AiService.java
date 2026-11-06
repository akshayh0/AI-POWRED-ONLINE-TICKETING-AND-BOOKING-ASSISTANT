package com.ticketease.ai.service;

import com.ticketease.ai.client.GroqClient;
import com.ticketease.ai.config.AiProperties;
import com.ticketease.ai.dto.ChatRequest;
import com.ticketease.ai.dto.ChatResponse;
import com.ticketease.ai.dto.ProviderChatRequest;
import com.ticketease.ai.dto.ProviderChatResponse;
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
    private final ConcurrentHashMap<String, List<ProviderChatRequest.ProviderMessage>> conversations =
            new ConcurrentHashMap<>();

    public AiService(GroqClient groqClient, AiProperties properties) {
        this.groqClient = groqClient;
        this.properties = properties;
    }

    public Mono<ChatResponse> chat(ChatRequest request) {
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
            return groqClient.complete(new ProviderChatRequest(properties.getModel(), messages, 0.2))
                    .map(providerResponse -> toResponse(conversationId, request.language(), history, providerResponse));
        }
    }

    public Mono<Status> status() {
        return groqClient.isReachable().map(reachable ->
                new Status(properties.isConfigured(), reachable, properties.getModel()));
    }

    private ChatResponse toResponse(String id, String language,
            List<ProviderChatRequest.ProviderMessage> history, ProviderChatResponse response) {
        if (response == null || response.choices() == null || response.choices().isEmpty()
                || response.choices().get(0).message() == null
                || response.choices().get(0).message().content() == null) {
            throw new AiProviderException("AI provider returned no message", 502, "provider_empty_response");
        }
        String content = response.choices().get(0).message().content();
        synchronized (history) {
            history.add(new ProviderChatRequest.ProviderMessage("assistant", content));
        }
        return new ChatResponse(id, content, language, List.of(
                "Refine the trip plan", "Compare options", "Ask about Kannada support"), null);
    }

    public record Status(boolean configured, boolean reachable, String model) {}
}
