package com.ticketease.ai.dto;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;

public record ChatResponse(
        String conversationId,
        String message,
        String language,
        List<String> suggestedActions,
        JsonNode structuredTripInformation) {
}
