package com.ticketease.ai.dto;

import java.util.List;

public record ProviderChatResponse(List<Choice> choices) {
    public record Choice(Message message) {}
    public record Message(String role, String content) {}
}
