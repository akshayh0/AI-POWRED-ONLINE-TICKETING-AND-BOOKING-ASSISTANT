package com.ticketease.ai.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatRequest(
        @NotBlank @Size(max = 4000) String message,
        @Size(max = 100) String conversationId,
        @NotBlank String language,
        JsonNode tripContext) {
}
