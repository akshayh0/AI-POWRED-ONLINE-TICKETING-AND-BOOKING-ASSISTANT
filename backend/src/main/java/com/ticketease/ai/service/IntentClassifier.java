package com.ticketease.ai.service;

import com.ticketease.ai.dto.AiIntent;
import com.ticketease.ai.dto.TripType;
import java.util.Locale;
import org.springframework.stereotype.Component;

@Component
public class IntentClassifier {
    public AiIntent classify(String message, boolean hasConversationContext) {
        String text = message.toLowerCase(Locale.ROOT);
        if (isGreeting(text)) return AiIntent.GREETING;
        if (isOutOfScope(text)) return AiIntent.OUT_OF_SCOPE;
        if (contains(text, "what services", "what can you do", "services does ticketease provide"))
            return AiIntent.TRAVEL_ASSISTANCE;
        if (hasConversationContext && isFollowUp(text)) return AiIntent.TRAVEL_FOLLOW_UP;
        if (contains(text, "cancel", "cancellation")) return AiIntent.BOOKING_CANCELLATION;
        if (contains(text, "group booking", "for a group", "group of")) return AiIntent.GROUP_BOOKING;
        if (contains(text, "booking status", "where is my booking", "reservation status"))
            return AiIntent.BOOKING_STATUS;
        if (contains(text, "resale", "resell", "sell my ticket")) return AiIntent.TICKET_RESALE;
        if (contains(text, "cinema", "movie ticket", "theatre ticket")) return AiIntent.CINEMA_BOOKING;
        if (contains(text, "seat", "stadium seat", "choose seats")) return AiIntent.STADIUM_SEAT_SELECTION;
        if (contains(text, "rcb", "cricket", "match ticket", "sports event"))
            return contains(text, "ticket", "tickets", "book") ? AiIntent.TICKET_BOOKING : AiIntent.SPORTS_EVENT_SEARCH;
        if (contains(text, "concert", "event", "festival", "show")) return AiIntent.EVENT_SEARCH;
        if (contains(text, "restaurant", "restaurants", "eat", "dining", "food near"))
            return AiIntent.RESTAURANT_SEARCH;
        if (contains(text, "tourist", "attraction", "places to visit", "destination", "explore"))
            return contains(text, "book", "ticket") ? AiIntent.ATTRACTION_BOOKING : AiIntent.DESTINATION_DISCOVERY;
        if (contains(text, "hotel", "hotels", "accommodation", "homestay", "stay"))
            return contains(text, "compare", "difference") ? AiIntent.HOTEL_SEARCH
                    : contains(text, "book", "reserve") ? AiIntent.ACCOMMODATION_BOOKING : AiIntent.HOTEL_SEARCH;
        if (contains(text, "rent", "rental", "vehicle", "car rental", "bike rental"))
            return AiIntent.VEHICLE_RENTAL;
        if (contains(text, "flight", "fly", "airport")) return AiIntent.FLIGHT_SEARCH;
        if (contains(text, "train", "railway", "shatabdi")) {
            return contains(text, "book", "reserve") ? AiIntent.TRAIN_BOOKING : AiIntent.TRANSPORT_SEARCH;
        }
        if (contains(text, "bus", "ksrtc")) {
            return contains(text, "book", "reserve") ? AiIntent.BUS_BOOKING : AiIntent.TRANSPORT_SEARCH;
        }
        if (contains(text, "cab", "taxi", "uber", "auto")) return AiIntent.CAB_BOOKING;
        if (contains(text, "budget", "₹", "inr", "cost", "price")) return AiIntent.BUDGET_PLANNING;
        if (contains(text, "itinerary", "complete trip", "plan a trip", "trip", "travel from", "travelling"))
            return AiIntent.TRIP_PLANNING;
        if (contains(text, "how can i travel", "how to get", "journey", "transport"))
            return AiIntent.TRAVEL_INFORMATION;
        if (contains(text, "ಮೈಸೂರು", "ಬೆಂಗಳೂರು", "ಪ್ರಯಾಣ", "ಜನ", "ಹೊಟೇಲ್", "ಹೋಟೆಲ್"))
            return AiIntent.TRIP_PLANNING;
        if (contains(text, "help", "assistance", "luggage", "visa")) return AiIntent.TRAVEL_ASSISTANCE;
        return hasConversationContext ? AiIntent.TRAVEL_FOLLOW_UP : AiIntent.OUT_OF_SCOPE;
    }

    public TripType classifyTripType(String message, AiIntent intent) {
        String text = message.toLowerCase(Locale.ROOT);
        if (contains(text, "rcb", "cricket", "match")) return TripType.CRICKET_MATCH_TRIP;
        if (contains(text, "concert", "live music", "festival")) return TripType.CONCERT_TRIP;
        if (contains(text, "cinema", "movie", "theatre")) return TripType.CINEMA_TRIP;
        if (contains(text, "business trip", "work trip", "conference")) return TripType.BUSINESS_TRIP;
        if (intent == AiIntent.VEHICLE_RENTAL) return TripType.RENTAL_ONLY;
        if (intent == AiIntent.HOTEL_SEARCH || intent == AiIntent.ACCOMMODATION_BOOKING)
            return TripType.HOTEL_ONLY;
        if (intent == AiIntent.TRANSPORT_SEARCH || intent == AiIntent.BUS_BOOKING
                || intent == AiIntent.TRAIN_BOOKING || intent == AiIntent.FLIGHT_SEARCH
                || intent == AiIntent.CAB_BOOKING) return TripType.TRANSPORT_ONLY;
        if (intent == AiIntent.DESTINATION_DISCOVERY || contains(text, "sightseeing", "tourist", "places to visit"))
            return TripType.TOURISM_TRIP;
        return TripType.GENERAL_TRIP;
    }

    private boolean isGreeting(String text) {
        return text.equals("hi") || text.equals("hello") || text.equals("hey")
                || text.startsWith("hi ") || text.startsWith("hello ") || text.startsWith("hey ")
                || contains(text, "namaste", "ನಮಸ್ಕಾರ", "ಹಾಯ್");
    }

    private boolean isOutOfScope(String text) {
        return contains(text, "python", "java program", "programming", "machine learning",
                "mathematics", "math problem", "physics", "general science", "code", "algorithm");
    }

    private boolean isFollowUp(String text) {
        return text.length() < 80 || text.matches(".*\\b(one|two|three|four|1|2|3|4)\\b.*");
    }

    private boolean contains(String text, String... values) {
        for (String value : values) {
            if (text.contains(value)) return true;
        }
        return false;
    }
}
