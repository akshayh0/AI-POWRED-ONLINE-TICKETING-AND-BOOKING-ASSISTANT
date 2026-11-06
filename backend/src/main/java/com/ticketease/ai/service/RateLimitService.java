package com.ticketease.ai.service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class RateLimitService {
    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();

    public boolean allow(String key, int limit) {
        Instant now = Instant.now();
        Window updated = windows.compute(key, (ignored, current) -> {
            if (current == null || Duration.between(current.startedAt(), now).toSeconds() >= 60) {
                return new Window(now, 1);
            }
            return new Window(current.startedAt(), current.count() + 1);
        });
        return updated.count() <= Math.max(1, limit);
    }

    private record Window(Instant startedAt, int count) {}
}
