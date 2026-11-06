package com.ticketease.ai.service;

public class AiProviderException extends RuntimeException {
    private final int status;
    private final String code;

    public AiProviderException(String message, int status, String code) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public static AiProviderException from(int status, String body) {
        String code = status == 401 ? "provider_authentication_failed"
                : status == 429 ? "provider_rate_limited" : "provider_error";
        String message = status == 401 ? "AI provider authentication failed"
                : status == 429 ? "AI provider rate limit reached"
                : "AI provider request failed";
        return new AiProviderException(message, status, code);
    }

    public int getStatus() { return status; }
    public String getCode() { return code; }
}
