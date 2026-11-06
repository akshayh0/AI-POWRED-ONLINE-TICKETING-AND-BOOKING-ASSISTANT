package com.ticketease.ai.controller;

import com.ticketease.ai.service.AiProviderException;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;

@RestControllerAdvice
public class AiExceptionHandler {
    @ExceptionHandler(AiProviderException.class)
    ResponseEntity<Map<String, String>> provider(AiProviderException exception) {
        return ResponseEntity.status(exception.getStatus())
                .body(Map.of("code", exception.getCode(), "message", exception.getMessage()));
    }

    @ExceptionHandler(WebExchangeBindException.class)
    ResponseEntity<Map<String, String>> validation(WebExchangeBindException exception) {
        return ResponseEntity.badRequest()
                .body(Map.of("code", "invalid_request", "message", "message and language are required"));
    }
}
