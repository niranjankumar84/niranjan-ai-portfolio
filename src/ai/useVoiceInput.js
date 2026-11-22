/**
 * useVoiceInput — Browser Speech Recognition hook
 *
 * Encapsulates the Web Speech API with explicit permission gating.
 * - Microphone is NEVER activated until the user explicitly clicks the mic button.
 * - Provides graceful degradation on unsupported browsers.
 */

import { useState, useRef, useCallback } from 'react';

export function useVoiceInput({ onTranscript, onError }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(() => {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const recognitionRef = useRef(null);

  const startListening = useCallback(async () => {
    if (!supported) {
      onError?.('Speech recognition is not supported in this browser. Please type your message instead.');
      return;
    }

    // Explicit permission request
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop()); // permission granted — stop immediately
    } catch (permErr) {
      if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
        onError?.('Microphone permission was denied. You can still type your message in the text field below.');
      } else {
        onError?.('Could not access the microphone. Please use the text field instead.');
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) onTranscript?.(transcript);
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === 'no-speech') {
        onError?.('No speech detected. Please try again or type your message.');
      } else if (event.error === 'not-allowed') {
        onError?.('Microphone access denied. Please use the text field instead.');
      } else {
        onError?.('Speech recognition error. Please use the text field instead.');
      }
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    setListening(true);
  }, [supported, onTranscript, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  return { listening, supported, startListening, stopListening };
}
