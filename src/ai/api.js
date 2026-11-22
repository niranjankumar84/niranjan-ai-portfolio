/**
 * NIRANJAN.AI — Voice & Chat API Client
 *
 * Abstraction layer for all backend communication.
 * Voice provider is swappable by changing BACKEND_URL.
 *
 * All API keys remain on the backend — never exposed here.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

/** Send a conversation message to the AI assistant. */
export async function sendChatMessage(messages) {
  const res = await fetch(`${BACKEND_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Chat API error (${res.status})`);
  }

  return res.json(); // { reply: string, action?: { action, section } }
}

/** Synthesise text to speech, returning an AudioBuffer via the backend TTS. */
export async function synthesiseSpeech(text, voice) {
  const res = await fetch(`${BACKEND_URL}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
  });

  if (!res.ok) {
    throw new Error(`TTS API error (${res.status})`);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/** Check backend health. */
export async function checkHealth() {
  const res = await fetch(`${BACKEND_URL}/api/health`);
  return res.ok ? res.json() : null;
}
