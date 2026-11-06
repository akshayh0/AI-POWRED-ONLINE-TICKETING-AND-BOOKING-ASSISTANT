package com.ticketease.ai.controller;

import com.ticketease.ai.config.AiProperties;
import com.ticketease.ai.dto.ChatRequest;
import com.ticketease.ai.dto.ChatResponse;
import com.ticketease.ai.service.AiService;
import com.ticketease.ai.service.AiProviderException;
import com.ticketease.ai.service.RateLimitService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {
    private final AiService aiService;
    private final AiProperties properties;
    private final RateLimitService rateLimitService;

    public AiController(AiService aiService, AiProperties properties, RateLimitService rateLimitService) {
        this.aiService = aiService;
        this.properties = properties;
        this.rateLimitService = rateLimitService;
    }

    @PostMapping("/chat")
    public Mono<ResponseEntity<ChatResponse>> chat(
            @Valid @RequestBody ChatRequest request, ServerHttpRequest httpRequest) {
        String address = httpRequest.getRemoteAddress() == null
                ? "unknown" : httpRequest.getRemoteAddress().getAddress().getHostAddress();
        if (!rateLimitService.allow(address, properties.getRequestsPerMinute())) {
            return Mono.error(new AiProviderException(
                    "Too many AI requests. Please try again shortly.", 429, "request_rate_limited"));
        }
        return aiService.chat(request, UUID.randomUUID().toString()).map(ResponseEntity::ok);
    }

    @GetMapping("/status")
    public Mono<AiService.Status> status() {
        return aiService.status();
    }
}
