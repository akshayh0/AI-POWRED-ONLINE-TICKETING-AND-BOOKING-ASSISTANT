package com.ticketease.ai.client;

import com.ticketease.ai.dto.ProviderChatRequest;
import com.ticketease.ai.dto.ProviderChatResponse;
import reactor.core.publisher.Mono;

public interface GroqClient {
    Mono<ProviderChatResponse> complete(ProviderChatRequest request, String correlationId);
    Mono<Boolean> isReachable();
    Mono<Boolean> isModelAvailable(String correlationId);
}
