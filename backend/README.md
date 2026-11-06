# TicketEase AI backend

This module provides the server-side Groq integration for the existing TicketEase
assistant. It does not contain booking or inventory services: this checkout has no
Spring entities, repositories, migrations, or booking APIs to connect to. The AI
is therefore instructed to avoid claiming live availability or confirmations.

## Run locally

Requirements: Java 21 and Maven.

```powershell
$env:GROQ_API_KEY = "replace-with-your-key"
$env:GROQ_MODEL = "llama-3.3-70b-versatile"
mvn spring-boot:run
```

Optional variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `GROQ_BASE_URL` | `https://api.groq.com/openai/v1` | OpenAI-compatible provider base URL |
| `GROQ_MODEL` | `openai/gpt-oss-20b` | Provider model name |
| `GROQ_TIMEOUT` | `30s` | Provider request timeout |
| `AI_REQUESTS_PER_MINUTE` | `20` | Per-client chat request limit |

Never put `GROQ_API_KEY` in the Next.js environment or browser code.

## API

### `GET /api/v1/ai/status`

Returns configuration and reachability without returning the API key:

```json
{
  "configured": true,
  "reachable": true,
  "model": "llama-3.3-70b-versatile"
}
```

`reachable` is checked against Groq's authenticated `/models` endpoint.

### `POST /api/v1/ai/chat`

```json
{
  "message": "Plan a trip from Mysuru to Bengaluru for four friends within INR 25000.",
  "conversationId": null,
  "language": "EN",
  "tripContext": {
    "groupType": "4adults",
    "budgetCap": 25000
  }
}
```

The response contains a server-generated conversation ID that should be sent on
subsequent requests:

```json
{
  "conversationId": "8cf6d4a0-3e18-4f3d-b8bd-9bbf0d7b6e2d",
  "message": "I can prepare that itinerary...",
  "language": "EN",
  "suggestedActions": ["Refine the trip plan", "Compare options"],
  "structuredTripInformation": null
}
```

Responses also include an `intent` enum such as `TRIP_PLANNING`,
`HOTEL_SEARCH`, `EVENT_SEARCH`, `BOOKING_CANCELLATION`, `GREETING`, or
`OUT_OF_SCOPE`. Out-of-scope requests are handled locally and are not sent
to Groq. Supported travel requests are sent to Groq with the classified intent
and conversation history.

The API returns `400` for invalid input, `429` for the local rate limit,
`401` for an invalid Groq key, `429` for a provider rate limit, `503` when
the provider is not configured, and `504` on provider timeout. Error bodies
contain a stable `code` and a user-safe `message`.

## Tools

**Connected tools: none.** No event, venue, seat, transport, hotel,
restaurant, budget, seat-hold, or booking service exists in this repository.
`ConnectedToolRegistry` intentionally returns an empty list rather than
inventing data. Booking actions must be added only after their transactional
backend services and explicit-confirmation flow exist.

## Tests

```powershell
mvn test
```

The tests mock the Groq client and do not make paid provider calls.

The frontend reads `NEXT_PUBLIC_API_BASE_URL` and defaults to
`http://localhost:8080`; set it in a local ignored `.env.local` if needed.
