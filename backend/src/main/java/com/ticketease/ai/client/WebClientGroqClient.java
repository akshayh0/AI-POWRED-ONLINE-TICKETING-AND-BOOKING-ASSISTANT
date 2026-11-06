package com.ticketease.ai.client;

import com.ticketease.ai.config.AiProperties;
import com.ticketease.ai.dto.ProviderChatRequest;
import com.ticketease.ai.dto.ProviderChatResponse;
import com.ticketease.ai.service.AiProviderException;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

@Component
public class WebClientGroqClient implements GroqClient {
    private static final Logger log = LoggerFactory.getLogger(WebClientGroqClient.class);
    private final WebClient client;
    private final AiProperties properties;

    public WebClientGroqClient(WebClient groqWebClient, AiProperties properties) {
        this.client = groqWebClient;
        this.properties = properties;
    }

    @Override
    public Mono<ProviderChatResponse> complete(ProviderChatRequest request, String correlationId) {
        if (!properties.isConfigured()) {
            return Mono.error(new AiProviderException("AI provider is not configured", 503,
                    "provider_not_configured", correlationId, null,
                    "GROQ_API_KEY is not available to the Spring Boot process"));
        }
        return client.post()
                .uri("/chat/completions")
                .headers(headers -> headers.setBearerAuth(properties.getApiKey()))
                .bodyValue(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("Groq provider returned an error")
                                .flatMap(body -> {
                                    AiProviderException exception = AiProviderException.from(
                                            response.statusCode().value(), body, correlationId);
                                    log.warn("Groq request failed: correlationId={}, upstreamStatus={}, "
                                                    + "providerCode={}, diagnostic={}",
                                            correlationId, exception.getUpstreamStatus(),
                                            exception.getProviderCode(), exception.getDiagnostic());
                                    return Mono.error(exception);
                                }))
                .bodyToMono(ProviderChatResponse.class)
                .timeout(properties.getTimeout())
                .onErrorMap(java.util.concurrent.TimeoutException.class,
                        ignored -> new AiProviderException("AI provider timed out", 504,
                                "provider_timeout", correlationId, null, "Provider request exceeded configured timeout"));
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
