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
import com.fasterxml.jackson.databind.JsonNode;
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
        log.info("Groq request started: correlationId={}, model={}, messageCount={}, roles={}, contentLengths={}",
                correlationId, request.model(), request.messages().size(),
                request.messages().stream().map(ProviderChatRequest.ProviderMessage::role).toList(),
                request.messages().stream().map(message -> message.content().length()).toList());
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

    @Override
    public Mono<Boolean> isModelAvailable() {
        if (!properties.isConfigured()) {
            return Mono.just(false);
        }
        return client.get()
                .uri("/models")
                .headers(headers -> headers.setBearerAuth(properties.getApiKey()))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(body -> {
                    for (JsonNode model : body.path("data")) {
                        if (properties.getModel().equals(model.path("id").asText())) {
                            return true;
                        }
                    }
                    return false;
                })
                .timeout(properties.getTimeout())
                .onErrorReturn(false);
    }
}
