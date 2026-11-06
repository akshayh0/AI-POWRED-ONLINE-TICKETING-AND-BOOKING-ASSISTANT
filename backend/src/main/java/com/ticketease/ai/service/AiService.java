package com.ticketease.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketease.ai.client.GroqClient;
import com.ticketease.ai.config.AiProperties;
import com.ticketease.ai.dto.ChatRequest;
import com.ticketease.ai.dto.ChatResponse;
import com.ticketease.ai.dto.AiIntent;
import com.ticketease.ai.dto.ProviderChatRequest;
import com.ticketease.ai.dto.ProviderChatResponse;
import com.ticketease.ai.dto.StructuredTripInformation;
import com.ticketease.ai.dto.TripType;
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
    private final IntentClassifier intentClassifier;
    private final ConcurrentHashMap<String, List<ProviderChatRequest.ProviderMessage>> conversations =
            new ConcurrentHashMap<>();

    public AiService(GroqClient groqClient, AiProperties properties, ObjectMapper objectMapper,
            IntentClassifier intentClassifier) {
        this.groqClient = groqClient;
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.intentClassifier = intentClassifier;
    }

    public Mono<ChatResponse> chat(ChatRequest request, String correlationId) {
        String conversationId = request.conversationId() == null || request.conversationId().isBlank()
                ? UUID.randomUUID().toString() : request.conversationId();
        List<ProviderChatRequest.ProviderMessage> history =
                conversations.computeIfAbsent(conversationId, ignored -> new ArrayList<>());
        boolean hasContext = !history.isEmpty();
        AiIntent intent = intentClassifier.classify(request.message(), hasContext);
        TripType requestedTripType = intentClassifier.classifyTripType(request.message(), intent);
        synchronized (history) {
            history.add(new ProviderChatRequest.ProviderMessage("user", request.message()));
            if (intent == AiIntent.OUT_OF_SCOPE) {
                String scopeMessage = request.language().equalsIgnoreCase("KN")
                        ? "ನಾನು TicketEase AI, ನಿಮ್ಮ ಪ್ರಯಾಣ ಮತ್ತು ಬುಕಿಂಗ್ ಸಹಾಯಕ. ಪ್ರವಾಸ, ಸಾರಿಗೆ, ಹೋಟೆಲ್, "
                        + "ರೆಸ್ಟೋರೆಂಟ್, ವಾಹನ ಬಾಡಿಗೆ, ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಟಿಕೆಟ್‌ಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು. ಏನು ಯೋಜಿಸೋಣ?"
                        : "I'm TicketEase AI, your travel and booking assistant. "
                        + "I can help you plan trips, discover destinations, book transport, find hotels, "
                        + "rent vehicles, explore restaurants and book tickets. What would you like to plan?";
                return Mono.just(new ChatResponse(conversationId, scopeMessage, request.language(), intent,
                        requestedTripType,
                        List.of("Plan a trip", "Find a hotel", "Explore destinations"), null));
            }
            if (intent == AiIntent.GREETING) {
                String greeting = request.language().equalsIgnoreCase("KN")
                        ? "ನಮಸ್ಕಾರ! ನಾನು TicketEase AI. ಪ್ರಯಾಣ, ಸಾರಿಗೆ, ವಸತಿ, ಆಹಾರ, ಪ್ರವಾಸಿ ಸ್ಥಳಗಳು ಮತ್ತು "
                        + "ಕಾರ್ಯಕ್ರಮಗಳ ಟಿಕೆಟ್‌ಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು. ಏನು ಯೋಜಿಸೋಣ?"
                        : "Hello! I’m TicketEase AI. I can help plan trips, find transport and stays, "
                        + "discover food and destinations, and explore events and tickets. What would you like to plan?";
                return Mono.just(new ChatResponse(conversationId, greeting, request.language(), intent,
                        requestedTripType,
                        List.of("Plan a trip", "Find transport", "Discover destinations"), null));
            }
            List<ProviderChatRequest.ProviderMessage> messages = new ArrayList<>();
            messages.add(new ProviderChatRequest.ProviderMessage("system", TicketEasePrompt.systemInstructions()));
            messages.add(new ProviderChatRequest.ProviderMessage("system",
                    "Classified user intent: " + intent.name()
                            + ". Answer the complete request within TicketEase's supported travel domain."));
            messages.addAll(history);
            if (request.tripContext() != null && !request.tripContext().isNull()) {
                messages.add(new ProviderChatRequest.ProviderMessage(
                        "system", "Current trip context (treat as user-provided, not verified): "
                                + request.tripContext()));
            }
            ProviderChatRequest providerRequest = new ProviderChatRequest(properties.getModel(), messages, 0.2);
            if (!properties.isConfigured()) {
                return Mono.error(new AiProviderException("AI provider is not configured", 503,
                        "provider_not_configured", correlationId, null,
                        "GROQ_API_KEY is not available to the Spring Boot process"));
            }
            return groqClient.isModelAvailable(correlationId).flatMap(modelAvailable -> {
                if (!modelAvailable) {
                    return Mono.error(new AiProviderException(
                            "Configured AI model is unavailable at the provider: " + properties.getModel(), 503,
                            "provider_model_unavailable", correlationId, null,
                            "Configured model is not present in the provider model list"));
                }
                return groqClient.complete(providerRequest, correlationId);
            })
                    .map(providerResponse -> toResponse(conversationId, request.language(), intent,
                            requestedTripType, history, providerResponse));
        }
    }

    public Mono<Status> status() {
        return groqClient.isReachable()
                .flatMap(reachable -> reachable
                        ? groqClient.isModelAvailable("status").map(modelAvailable ->
                                new Status(properties.isConfigured(), true, modelAvailable, properties.getModel()))
                        : Mono.just(new Status(properties.isConfigured(), false, false, properties.getModel())));
    }

    private ChatResponse toResponse(String id, String language,
            AiIntent intent, TripType requestedTripType,
            List<ProviderChatRequest.ProviderMessage> history,
            ProviderChatResponse response) {
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
        StructuredTripInformation trip = normalizeTrip(parsed.structuredTripInformation(), requestedTripType);
        return new ChatResponse(id, parsed.message(), language, intent, requestedTripType,
                parsed.suggestedActions(), trip);
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
            if (trip != null && trip.missingInformation() == null) {
                trip = new StructuredTripInformation(trip.tripType(), trip.origin(), trip.destination(), trip.travelDate(),
                        trip.returnDate(), trip.passengerCount(), trip.budget(), trip.currency(),
                        trip.eventCategory(), trip.eventName(), trip.stadiumOrVenue(),
                        trip.transportPreference(), trip.accommodationPreference(), trip.foodPreference(),
                        trip.eventRequested(), trip.itinerary(), trip.transportOptions(),
                        trip.accommodationOptions(), trip.attractions(), trip.restaurants(),
                        trip.budgetBreakdown(),
                        List.of(), trip.planningStatus());
            }
            return new ParsedAssistantResponse(message, actions, trip);
        } catch (Exception ignored) {
            return fallback(content);
        }
    }

    private StructuredTripInformation normalizeTrip(StructuredTripInformation trip, TripType requestedTripType) {
        if (trip == null) return null;
        boolean eventRequested = requestedTripType == TripType.EVENT_TRIP
                || requestedTripType == TripType.CRICKET_MATCH_TRIP
                || requestedTripType == TripType.CINEMA_TRIP
                || requestedTripType == TripType.CONCERT_TRIP;
        if (eventRequested) return trip;
        return new StructuredTripInformation(requestedTripType, trip.origin(), trip.destination(),
                trip.travelDate(), trip.returnDate(), trip.passengerCount(), trip.budget(), trip.currency(),
                null, null, null, trip.transportPreference(), trip.accommodationPreference(),
                trip.foodPreference(), false, trip.itinerary(), trip.transportOptions(),
                trip.accommodationOptions(), trip.attractions(), trip.restaurants(),
                trip.budgetBreakdown(), trip.missingInformation(), trip.planningStatus());
    }

    private ParsedAssistantResponse fallback(String content) {
        return new ParsedAssistantResponse(content, List.of(
                "Refine the trip plan", "Compare options", "Ask about Kannada support"), null);
    }

    private record ParsedAssistantResponse(
            String message, List<String> suggestedActions,
            StructuredTripInformation structuredTripInformation) {}
}
