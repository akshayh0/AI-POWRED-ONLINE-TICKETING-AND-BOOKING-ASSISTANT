package com.ticketease.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class AiProviderException extends RuntimeException {
    private final int status;
    private final String code;
    private final String correlationId;
    private final Integer upstreamStatus;
    private final String providerCode;
    private final String diagnostic;

    public AiProviderException(String message, int status, String code) {
        this(message, status, code, null, null, null);
    }

    public AiProviderException(String message, int status, String code, String correlationId,
            Integer upstreamStatus, String diagnostic) {
        this(message, status, code, correlationId, upstreamStatus, code, diagnostic);
    }

    private AiProviderException(String message, int status, String code, String correlationId,
            Integer upstreamStatus, String providerCode, String diagnostic) {
        super(message);
        this.status = status;
        this.code = code;
        this.correlationId = correlationId;
        this.upstreamStatus = upstreamStatus;
        this.providerCode = providerCode;
        this.diagnostic = diagnostic;
    }

    public static AiProviderException from(int status, String body, String correlationId) {
        String providerCode = "unknown";
        String diagnostic = "Groq returned HTTP " + status;
        try {
            JsonNode error = new ObjectMapper().readTree(body).path("error");
            if (error.hasNonNull("code")) {
                providerCode = error.get("code").asText();
            } else if (error.hasNonNull("type")) {
                providerCode = error.get("type").asText();
            }
            if (error.hasNonNull("message")) {
                diagnostic = error.get("message").asText();
            }
        } catch (Exception ignored) {
            // Provider error bodies are diagnostic-only and may not be JSON.
        }
        String code = status == 401 ? "provider_authentication_failed"
                : status == 403 ? "provider_permission_denied"
                : status == 429 ? "provider_rate_limited"
                : status == 400 || status == 404 ? "provider_model_or_request_invalid"
                : "provider_error";
        String message = status == 401 ? "AI provider authentication failed"
                : status == 403 ? "AI provider permission denied"
                : status == 429 ? "AI provider rate limit reached"
                : status == 400 || status == 404 ? "AI provider rejected the model or request"
                : "AI provider request failed";
        return new AiProviderException(message, status, code, correlationId, status, providerCode, diagnostic);
    }

    public int getStatus() { return status; }
    public String getCode() { return code; }
    public String getCorrelationId() { return correlationId; }
    public Integer getUpstreamStatus() { return upstreamStatus; }
    public String getProviderCode() { return providerCode; }
    public String getDiagnostic() { return diagnostic; }
}
