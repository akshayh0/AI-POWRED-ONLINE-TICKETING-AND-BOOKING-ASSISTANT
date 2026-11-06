package com.ticketease.ai.dto;

import java.util.List;

public record ChatResponse(
        String conversationId,
        String message,
        String language,
        List<String> suggestedActions,
        StructuredTripInformation structuredTripInformation) {
}
