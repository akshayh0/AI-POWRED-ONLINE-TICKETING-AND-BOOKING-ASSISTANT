package com.ticketease.ai.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.ticketease.ai.client.GroqClient;
import com.ticketease.ai.config.AiProperties;
import com.ticketease.ai.dto.ChatRequest;
import com.ticketease.ai.dto.ProviderChatResponse;
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

        AiService service = new AiService(client, properties);
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
        AiService service = new AiService(client, new AiProperties());

        StepVerifier.create(service.chat(new ChatRequest("Hello", null, "EN", null), "test-correlation-id"))
                .expectErrorMatches(error -> error instanceof AiProviderException
                        && ((AiProviderException) error).getStatus() == 503)
                .verify();
    }
}
