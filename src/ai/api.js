/**
 * NIRANJAN.AI — Voice & Chat API Client
 *
 * Abstraction layer for all backend communication.
 * Voice provider is swappable by changing BACKEND_URL.
 *
 * All API keys remain securely on the backend — never exposed here.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

/** Send a conversation message to the AI assistant with explicit timeout handling. */
export async function sendChatMessage(messages) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Chat API error (${res.status})`);
    }

    return res.json(); // { reply: string, action?: { action, target }, agent_trace?: [...] }
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Backend communication timed out (15s ceiling reached).');
    }
    if (err.message && err.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to FastAPI backend at http://localhost:8000.');
    }
    throw err;
  }
}

/** Synthesise text to speech, returning an audio blob URL with 8s timeout. */
export async function synthesiseSpeech(text, voice) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${BACKEND_URL}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`TTS API error (${res.status})`);
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/** Check backend health status. */
export async function checkHealth() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok ? res.json() : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}
