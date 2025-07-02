import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

/**
 * useVapi — React hook
 * • spins up a Vapi client
 * • exposes start()/stop()
 * • streams mic volume (0–1) for UI animation
 * • logs SDK errors and raw mic levels
 */
export function useVapi(apiKey: string, assistantId: string) {
  const vapiRef = useRef<Vapi | null>(null);

  const [amp,         setAmp]         = useState(0); // live mic loudness 0-1
  const [status,      setStatus]      =
    useState<'idle' | 'calling' | 'ended'>('idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);

  /* ───────── initialise once ───────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    /* error events */
    vapi.on('error', (err) => console.error('[Vapi error]', err));

    /* non-typed “volume” event – fires ~10×/sec with float 0-1 */
    // @ts-expect-error volume isn't yet in the SDK's type defs
    vapi.on('volume', (v: number) => {
      console.log('mic level', v);   // ← DEBUG: watch numbers change as you talk
      setAmp(v);
    });

    vapi.on('call-start', () => setStatus('calling'));
    vapi.on('call-end',   () => setStatus('ended'));

    vapi.on('message', (m) => {
      if (m.type === 'transcript') {
        setTranscripts((t) => [...t, `${m.role}: ${m.transcript}`]);
      }
    });

    return () => vapi.stop();
  }, [apiKey]);

  /* ───────── helpers ───────── */
  const start = () => {
    /* 15-second grace period for first customer speech */
    // @ts-expect-error assistantOverrides typings lag behind
    vapiRef.current?.start(assistantId, {
      timeoutToCustomerSpeechMs: 15000,
    });
  };

  const stop = () => vapiRef.current?.stop();

  return { start, stop, amp, status, transcripts };
}







