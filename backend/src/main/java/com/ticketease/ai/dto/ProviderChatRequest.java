package com.ticketease.ai.dto;

import java.util.List;

public record ProviderChatRequest(String model, List<ProviderMessage> messages, double temperature) {
    public record ProviderMessage(String role, String content) {}
}
