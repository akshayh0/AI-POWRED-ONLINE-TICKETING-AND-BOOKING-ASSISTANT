package com.ticketease.health;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class HealthController {
    @GetMapping(value = "/health", produces = "application/json;charset=UTF-8")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "ticketease-ai");
    }
}
