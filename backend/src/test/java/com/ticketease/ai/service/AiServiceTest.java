package com.ticketease.ai.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.ticketease.ai.client.GroqClient;
import com.ticketease.ai.config.AiProperties;
import com.ticketease.ai.dto.ChatRequest;
import com.ticketease.ai.dto.ProviderChatResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.Test;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

class AiServiceTest {
    @Test
    void preservesConversationIdAndProviderResponse() {
        GroqClient client = org.mockito.Mockito.mock(GroqClient.class);
        AiProperties properties = new AiProperties();
        properties.setApiKey("test-key");
        when(client.isModelAvailable()).thenReturn(Mono.just(true));
        when(client.complete(any(), any())).thenReturn(Mono.just(new ProviderChatResponse(
                List.of(new ProviderChatResponse.Choice(
                        new ProviderChatResponse.Message("assistant", "Hello from mocked Groq"))))));

        AiService service = new AiService(client, properties, new ObjectMapper());
        StepVerifier.create(service.chat(new ChatRequest("Hello", null, "EN", null), "test-correlation-id"))
                .assertNext(response -> {
                    assertThat(response.conversationId()).isNotBlank();
                    assertThat(response.message()).isEqualTo("Hello from mocked Groq");
                    assertThat(response.language()).isEqualTo("EN");
                })
                .verifyComplete();
    }

    @Test
    void rejectsUnconfiguredProviderBeforeHttpCall() {
        GroqClient client = org.mockito.Mockito.mock(GroqClient.class);
        when(client.complete(any(), any())).thenReturn(
                Mono.error(new AiProviderException("AI provider is not configured", 503, "provider_not_configured")));
        when(client.isModelAvailable()).thenReturn(Mono.just(true));
        AiService service = new AiService(client, new AiProperties(), new ObjectMapper());

        StepVerifier.create(service.chat(new ChatRequest("Hello", null, "EN", null), "test-correlation-id"))
                .expectErrorMatches(error -> error instanceof AiProviderException
                        && ((AiProviderException) error).getStatus() == 503)
                .verify();
    }

    @Test
    void parsesIncompleteStructuredTripAndPreservesKannada() {
        GroqClient client = org.mockito.Mockito.mock(GroqClient.class);
        AiProperties properties = new AiProperties();
        properties.setApiKey("test-key");
        when(client.isModelAvailable()).thenReturn(Mono.just(true));
        when(client.complete(any(), any())).thenReturn(Mono.just(new ProviderChatResponse(List.of(
                new ProviderChatResponse.Choice(new ProviderChatResponse.Message("assistant",
                        """
                        {"message":"ದಯವಿಟ್ಟು ಪ್ರಯಾಣದ ದಿನಾಂಕವನ್ನು ತಿಳಿಸಿ.","suggestedActions":["ದಿನಾಂಕ ಸೇರಿಸಿ"],"structuredTripInformation":{"origin":"ಮೈಸೂರು","destination":"ಬೆಂಗಳೂರು","travelDate":null,"returnDate":null,"passengerCount":4,"budget":25000,"currency":"INR","eventCategory":"ಕ್ರಿಕೆಟ್","eventName":"RCB match","stadiumOrVenue":null,"transportPreference":"ರೈಲು","accommodationPreference":null,"foodPreference":null,"missingInformation":["travelDate","stadiumOrVenue"],"planningStatus":"INCOMPLETE"}}"""))))));

        AiService service = new AiService(client, properties, new ObjectMapper());
        StepVerifier.create(service.chat(new ChatRequest("ಮೈಸೂರಿನಿಂದ ಬೆಂಗಳೂರಿಗೆ ನಾಲ್ಕು ಜನ", null, "KN", null), "kn-test"))
                .assertNext(response -> {
                    assertThat(response.message()).contains("ದಯವಿಟ್ಟು");
                    assertThat(response.structuredTripInformation().origin()).isEqualTo("ಮೈಸೂರು");
                    assertThat(response.structuredTripInformation().travelDate()).isNull();
                    assertThat(response.structuredTripInformation().missingInformation())
                            .containsExactly("travelDate", "stadiumOrVenue");
                })
                .verifyComplete();
    }

    @Test
    void parsesCompleteStructuredTrip() {
        GroqClient client = org.mockito.Mockito.mock(GroqClient.class);
        AiProperties properties = new AiProperties();
        properties.setApiKey("test-key");
        when(client.isModelAvailable()).thenReturn(Mono.just(true));
        when(client.complete(any(), any())).thenReturn(Mono.just(new ProviderChatResponse(List.of(
                new ProviderChatResponse.Choice(new ProviderChatResponse.Message("assistant",
                        """
                        {"message":"Your trip draft is ready.","suggestedActions":["Review draft"],"structuredTripInformation":{"origin":"Mysuru","destination":"Bengaluru","travelDate":"2026-12-12","returnDate":"2026-12-13","passengerCount":4,"budget":25000,"currency":"INR","eventCategory":"cricket","eventName":"RCB match","stadiumOrVenue":"M. Chinnaswamy Stadium","transportPreference":"train","accommodationPreference":"hotel","foodPreference":"local food","missingInformation":[],"planningStatus":"READY"}}"""))))));

        AiService service = new AiService(client, properties, new ObjectMapper());
        StepVerifier.create(service.chat(new ChatRequest("Plan the complete trip", null, "EN", null), "complete-test"))
                .assertNext(response -> {
                    assertThat(response.structuredTripInformation().planningStatus()).isEqualTo("READY");
                    assertThat(response.structuredTripInformation().budget()).isEqualTo(25000);
                    assertThat(response.structuredTripInformation().missingInformation()).isEmpty();
                })
                .verifyComplete();
    }

    @Test
    void fallsBackSafelyWhenProviderReturnsMalformedJson() {
        GroqClient client = org.mockito.Mockito.mock(GroqClient.class);
        AiProperties properties = new AiProperties();
        properties.setApiKey("test-key");
        when(client.isModelAvailable()).thenReturn(Mono.just(true));
        when(client.complete(any(), any())).thenReturn(Mono.just(new ProviderChatResponse(List.of(
                new ProviderChatResponse.Choice(new ProviderChatResponse.Message("assistant",
                        "I need your travel date."))))));

        AiService service = new AiService(client, properties, new ObjectMapper());
        StepVerifier.create(service.chat(new ChatRequest("Plan a trip", null, "EN", null), "malformed-test"))
                .assertNext(response -> {
                    assertThat(response.message()).isEqualTo("I need your travel date.");
                    assertThat(response.structuredTripInformation()).isNull();
                })
                .verifyComplete();
    }
}
