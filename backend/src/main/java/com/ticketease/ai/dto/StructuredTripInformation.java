package com.ticketease.ai.dto;

import java.util.List;

public record StructuredTripInformation(
        String origin,
        String destination,
        String travelDate,
        String returnDate,
        Integer passengerCount,
        Integer budget,
        String currency,
        String eventCategory,
        String eventName,
        String stadiumOrVenue,
        String transportPreference,
        String accommodationPreference,
        String foodPreference,
        List<String> missingInformation,
        String planningStatus) {
}
