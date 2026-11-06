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
}
