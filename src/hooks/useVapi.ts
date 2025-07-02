import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

/**
 * useVapi – React hook
 * ───────────────────
 * • start()/stop() helpers
 * • amp          → live mic loudness (0–1) for ring animation
 * • status       → 'idle' | 'calling' | 'ended'
 * • transcripts  → FINAL lines only (no duplicates)
 * • detailed error logging (HTTP status + first server message)
 */
export function useVapi(apiKey: string, assistantId: string) {
  const vapiRef = useRef<Vapi | null>(null);

  /* reactive state for the UI */
  const [amp,         setAmp]         = useState(0);
  const [status,      setStatus]      =
    useState<'idle' | 'calling' | 'ended'>('idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);

  /* ───────── initialise once ───────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    /* ----- error logger ----- */
    vapi.on('error', async (e) => {
      console.error('[Vapi error]', e);

      if (e.error instanceof Response) {
        const raw  = e.error.clone();
        const body = (await raw.json().catch(() => raw.text())) ?? '(empty)';
        console.error('→ status', e.error.status, body);

        if (typeof body === 'object' && body?.message) {
          const first = Array.isArray(body.message)
            ? body.message[0]
            : body.message;
          console.error('→ detail', first);
        }
      }
    });

    /* live mic loudness (SDK “volume” event — not yet typed) */
    // @ts-ignore – "volume" missing from SDK .d.ts
    vapi.on('volume', (v: number) => setAmp(v));

    vapi.on('call-start', () => setStatus('calling'));
    vapi.on('call-end',   () => setStatus('ended'));

    /* ----- final transcripts only ----- */
    vapi.on('message', (m) => {
      console.log('[Vapi message]', m); // debug dump

      const obj = m as any; // runtime payload

      const finalFlag =
        obj.transcriptType === 'final' ||  // your account’s format
        obj.isFinal ||
        obj.is_final ||
        obj.final;

      const isTranscript =
        obj.type === 'transcript' ||
        obj.type === 'assistant' ||
        obj.type === 'assistant_response' ||
        obj.type === 'assistant_transcript';

      if (isTranscript && finalFlag && obj.transcript) {
        console.log('TRANSCRIPT FINAL:', obj.role, obj.transcript);
        setTranscripts((t) => [...t, `${obj.role}: ${obj.transcript}`]);
      }
    });

    /* clean-up on unmount */
    return () => vapi.stop();
  }, [apiKey]);

  /* public helpers */
  const start = () => vapiRef.current?.start(assistantId);
  const stop  = () => vapiRef.current?.stop();

  return { start, stop, amp, status, transcripts };
}














