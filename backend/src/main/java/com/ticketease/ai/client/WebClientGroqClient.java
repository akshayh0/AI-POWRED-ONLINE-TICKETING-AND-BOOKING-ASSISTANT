package com.ticketease.ai.client;

import com.ticketease.ai.config.AiProperties;
import com.ticketease.ai.dto.ProviderChatRequest;
import com.ticketease.ai.dto.ProviderChatResponse;
import com.ticketease.ai.service.AiProviderException;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class WebClientGroqClient implements GroqClient {
    private final WebClient client;
    private final AiProperties properties;

    public WebClientGroqClient(WebClient groqWebClient, AiProperties properties) {
        this.client = groqWebClient;
        this.properties = properties;
    }

    @Override
    public Mono<ProviderChatResponse> complete(ProviderChatRequest request) {
        if (!properties.isConfigured()) {
            return Mono.error(new AiProviderException("AI provider is not configured", 503, "provider_not_configured"));
        }
        return client.post()
                .uri("/chat/completions")
                .headers(headers -> headers.setBearerAuth(properties.getApiKey()))
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("Groq provider returned an error")
                                .flatMap(body -> Mono.error(AiProviderException.from(response.statusCode().value(), body))))
                .bodyToMono(ProviderChatResponse.class)
                .timeout(properties.getTimeout())
                .onErrorMap(java.util.concurrent.TimeoutException.class,
                        ignored -> new AiProviderException("AI provider timed out", 504, "provider_timeout"));
    }

    @Override
    public Mono<Boolean> isReachable() {
        if (!properties.isConfigured()) {
            return Mono.just(false);
        }
        return client.get()
                .uri("/models")
                .headers(headers -> headers.setBearerAuth(properties.getApiKey()))
                .exchangeToMono(response -> Mono.just(response.statusCode().is2xxSuccessful()))
                .timeout(properties.getTimeout())
                .onErrorReturn(false);
    }
}
