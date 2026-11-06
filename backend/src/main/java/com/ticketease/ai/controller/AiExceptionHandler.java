package com.ticketease.ai.controller;

import com.ticketease.ai.service.AiProviderException;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestControllerAdvice
public class AiExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(AiExceptionHandler.class);

    @ExceptionHandler(AiProviderException.class)
    ResponseEntity<Map<String, String>> provider(AiProviderException exception) {
        log.warn("AI request failed: correlationId={}, upstreamStatus={}, providerCode={}, diagnostic={}",
                exception.getCorrelationId(), exception.getUpstreamStatus(),
                exception.getProviderCode(), exception.getDiagnostic());
        Map<String, String> body = new java.util.HashMap<>();
        body.put("code", exception.getCode());
        body.put("message", exception.getMessage());
        if (exception.getCorrelationId() != null) {
            body.put("correlationId", exception.getCorrelationId());
        }
        return ResponseEntity.status(exception.getStatus()).body(body);
    }

    @ExceptionHandler(WebExchangeBindException.class)
    ResponseEntity<Map<String, String>> validation(WebExchangeBindException exception) {
        return ResponseEntity.badRequest()
                .body(Map.of("code", "invalid_request", "message", "message and language are required"));
    }
}
