import type { Language } from '@/context/LanguageContext';

export interface AiChatRequest {
  message: string;
  conversationId?: string;
  language: Language;
  tripContext?: Record<string, unknown>;
}

export interface AiChatResponse {
  conversationId: string;
  message: string;
  language: Language;
  suggestedActions: string[];
  structuredTripInformation: Record<string, unknown> | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export async function sendAiMessage(request: AiChatRequest): Promise<AiChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message || `AI request failed (${response.status})`);
  }

  return response.json() as Promise<AiChatResponse>;
}
