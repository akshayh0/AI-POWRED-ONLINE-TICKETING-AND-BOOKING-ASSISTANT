package com.ticketease.ai.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class RateLimitServiceTest {
    @Test
    void limitsRequestsWithinOneMinuteWindow() {
        RateLimitService service = new RateLimitService();
        assertThat(service.allow("test-client", 2)).isTrue();
        assertThat(service.allow("test-client", 2)).isTrue();
        assertThat(service.allow("test-client", 2)).isFalse();
    }
}
