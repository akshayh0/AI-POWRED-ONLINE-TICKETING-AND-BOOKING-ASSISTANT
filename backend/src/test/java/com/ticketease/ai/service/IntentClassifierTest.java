package com.ticketease.ai.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.ticketease.ai.dto.AiIntent;
import org.junit.jupiter.api.Test;

class IntentClassifierTest {
    private final IntentClassifier classifier = new IntentClassifier();

    @Test
    void classifiesSupportedTravelRequests() {
        assertThat(classifier.classify("Find hotels in Bengaluru", false))
                .isEqualTo(AiIntent.HOTEL_SEARCH);
        assertThat(classifier.classify("Find car rentals in Mysuru", false))
                .isEqualTo(AiIntent.VEHICLE_RENTAL);
        assertThat(classifier.classify("Suggest tourist places in Karnataka", false))
                .isEqualTo(AiIntent.DESTINATION_DISCOVERY);
        assertThat(classifier.classify("Find RCB match tickets", false))
                .isEqualTo(AiIntent.TICKET_BOOKING);
        assertThat(classifier.classify("Find concerts in Bengaluru", false))
                .isEqualTo(AiIntent.EVENT_SEARCH);
        assertThat(classifier.classify("Help me cancel my booking", false))
                .isEqualTo(AiIntent.BOOKING_CANCELLATION);
        assertThat(classifier.classify("What services does TicketEase provide?", false))
                .isEqualTo(AiIntent.TRAVEL_ASSISTANCE);
    }

    @Test
    void classifiesOutOfScopeAndFollowUps() {
        assertThat(classifier.classify("Explain Python programming", false))
                .isEqualTo(AiIntent.OUT_OF_SCOPE);
        assertThat(classifier.classify("Four", true))
                .isEqualTo(AiIntent.TRAVEL_FOLLOW_UP);
        assertThat(classifier.classify("cricket tickets", false))
                .isEqualTo(AiIntent.TICKET_BOOKING);
    }

    @Test
    void classifiesExplicitTripTypesWithoutInferringEvents() {
        assertThat(classifier.classifyTripType(
                "Plan a Mysuru to Bengaluru trip for four friends within ₹25,000.",
                AiIntent.TRIP_PLANNING)).isEqualTo(com.ticketease.ai.dto.TripType.GENERAL_TRIP);
        assertThat(classifier.classifyTripType(
                "Plan a Bengaluru sightseeing trip.", AiIntent.DESTINATION_DISCOVERY))
                .isEqualTo(com.ticketease.ai.dto.TripType.TOURISM_TRIP);
        assertThat(classifier.classifyTripType(
                "Plan a Bengaluru trip to watch an RCB match.", AiIntent.SPORTS_EVENT_SEARCH))
                .isEqualTo(com.ticketease.ai.dto.TripType.CRICKET_MATCH_TRIP);
        assertThat(classifier.classifyTripType(
                "Find a concert in Bengaluru and plan my trip.", AiIntent.EVENT_SEARCH))
                .isEqualTo(com.ticketease.ai.dto.TripType.CONCERT_TRIP);
    }

    @Test
    void coversAllCriticalRegressionPrompts() {
        assertThat(classifier.classifyTripType(
                "Plan a Mysuru to Bengaluru trip for four friends within ₹25,000.", AiIntent.TRIP_PLANNING))
                .isEqualTo(com.ticketease.ai.dto.TripType.GENERAL_TRIP);
        assertThat(classifier.classifyTripType(
                "Plan a two-day Bengaluru sightseeing trip.", AiIntent.DESTINATION_DISCOVERY))
                .isEqualTo(com.ticketease.ai.dto.TripType.TOURISM_TRIP);
        assertThat(classifier.classifyTripType(
                "Plan a Bengaluru trip for four friends to watch an RCB match.", AiIntent.SPORTS_EVENT_SEARCH))
                .isEqualTo(com.ticketease.ai.dto.TripType.CRICKET_MATCH_TRIP);
        assertThat(classifier.classify("Find a budget hotel in Bengaluru.", false))
                .isEqualTo(AiIntent.HOTEL_SEARCH);
        assertThat(classifier.classify("Find a rental car in Mysuru.", false))
                .isEqualTo(AiIntent.VEHICLE_RENTAL);
        assertThat(classifier.classifyTripType(
                "Plan a trip to Bengaluru and suggest nearby tourist places.", AiIntent.DESTINATION_DISCOVERY))
                .isEqualTo(com.ticketease.ai.dto.TripType.TOURISM_TRIP);
        assertThat(classifier.classifyTripType(
                "Find a concert in Bengaluru and plan my trip.", AiIntent.EVENT_SEARCH))
                .isEqualTo(com.ticketease.ai.dto.TripType.CONCERT_TRIP);
    }
}
