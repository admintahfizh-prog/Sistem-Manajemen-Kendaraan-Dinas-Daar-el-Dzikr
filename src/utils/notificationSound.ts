/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotificationType } from '../types';

// Web Audio API Context singleton
let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Play a crystal-clear, modern 3-tone acoustic chime using Web Audio API
 */
export const playChime = (type: NotificationType = 'booking_new') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Frequencies depending on notification type
    let tones: number[] = [587.33, 739.99, 880]; // D5, F#5, A5 (Major chord)
    if (type === 'booking_new') {
      tones = [523.25, 659.25, 783.99]; // C5, E5, G5 (Permohonan Baru)
    } else if (type === 'ready_pickup') {
      tones = [440, 554.37, 659.25]; // A4, C#5, E5 (Siap Ambil)
    } else if (type === 'returned') {
      tones = [587.33, 880, 1046.5]; // D5, A5, C6 (Selesai Kembali)
    }

    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      // Smooth attack and decay envelope
      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.55);
    });
  } catch (err) {
    console.warn('Audio chime playback error:', err);
  }
};

/**
 * AI Voice Announcement using browser Web Speech Synthesis API (Suara Pria / Laki-laki)
 */
export const speakAiVoice = (text: string) => {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any pending utterance

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.94; // Steady masculine cadence
    utterance.pitch = 0.82; // Deep, natural male voice pitch

    // Select male Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('id') ||
        v.lang.toLowerCase().includes('indonesia') ||
        v.name.toLowerCase().includes('indonesia')
    );

    // Look for male voice among Indonesian voices
    const idMaleVoice = indonesianVoices.find(
      (v) =>
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('pria') ||
        v.name.toLowerCase().includes('laki') ||
        v.name.toLowerCase().includes('ardi') ||
        v.name.toLowerCase().includes('andika') ||
        v.name.toLowerCase().includes('dfz')
    );

    if (idMaleVoice) {
      utterance.voice = idMaleVoice;
      utterance.pitch = 0.85;
    } else if (indonesianVoices.length > 0) {
      // Use available Indonesian voice adjusted with lower resonant male pitch
      utterance.voice = indonesianVoices[0];
      utterance.pitch = 0.78;
    } else {
      // Fallback: look for general male voice
      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('david') ||
          v.name.toLowerCase().includes('george')
      );
      if (maleVoice) {
        utterance.voice = maleVoice;
      }
      utterance.pitch = 0.80;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
};

/**
 * Combined Notification Trigger: Audio Chime + AI Voice
 */
export const triggerAiNotification = ({
  type,
  voiceText,
  playAudio = true,
  playVoice = true,
}: {
  type: NotificationType;
  voiceText: string;
  playAudio?: boolean;
  playVoice?: boolean;
}) => {
  if (playAudio) {
    playChime(type);
  }

  if (playVoice && voiceText) {
    // Delay voice slightly so the chime plays first
    setTimeout(() => {
      speakAiVoice(voiceText);
    }, 450);
  }
};
