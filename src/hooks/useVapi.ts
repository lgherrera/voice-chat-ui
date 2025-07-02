import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

/**
 *   useVapi – React hook
 *   ──────────────
 *   • spins up a Vapi client
 *   • exposes start()/stop()
 *   • streams mic volume for UI rings
 *   • logs any SDK errors
 */
export function useVapi(apiKey: string, assistantId: string) {
  const vapiRef = useRef<Vapi | null>(null);

  const [amp,         setAmp]         = useState(0); // live mic loudness (0-1)
  const [status,      setStatus]      =
    useState<'idle' | 'calling' | 'ended'>('idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);

  /* ───────── initialise once ───────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    /** error messages */
    vapi.on('error', (err) => console.error('[Vapi error]', err));

    /** non-typed “volume” event – 10× sec, 0-1 float */
    // @ts-expect-error — not yet in sdk types
    vapi.on('volume', (v: number) => setAmp(v));

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
  const start = () => vapiRef.current?.start(assistantId);
  const stop  = () => vapiRef.current?.stop();

  return { start, stop, amp, status, transcripts };
}






