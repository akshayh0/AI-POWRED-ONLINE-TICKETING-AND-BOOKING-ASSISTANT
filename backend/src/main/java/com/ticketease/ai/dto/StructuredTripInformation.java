package com.ticketease.ai.dto;

import java.util.List;

public record StructuredTripInformation(
        TripType tripType,
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
        Boolean eventRequested,
        List<String> itinerary,
        List<String> transportOptions,
        List<String> accommodationOptions,
        List<String> attractions,
        List<String> restaurants,
        java.util.Map<String, Object> budgetBreakdown,
        List<String> missingInformation,
        String planningStatus) {
}
