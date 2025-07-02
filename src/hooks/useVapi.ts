import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

/**
 * useVapi – React hook
 * • start()/stop() helpers
 * • amp    : live mic loudness (0–1)
 * • status : 'idle' | 'calling' | 'ended'
 * • transcripts : FINAL user + assistant lines (no duplicates)
 * • detailed error logging
 */
export function useVapi(apiKey: string, assistantId: string) {
  const vapiRef = useRef<Vapi | null>(null);

  const [amp,         setAmp]         = useState(0);
  const [status,      setStatus]      =
    useState<'idle' | 'calling' | 'ended'>('idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);

  /* ───────── initialise once ───────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    /* error logger (prints HTTP status + first detail) */
    vapi.on('error', async (e) => {
      console.error('[Vapi error]', e);
      if (e.error instanceof Response) {
        const raw  = e.error.clone();
        const body = (await raw.json().catch(() => raw.text())) ?? '(empty)';
        console.error('→ status', e.error.status, body);
        if (typeof body === 'object' && body?.message) {
          const first = Array.isArray(body.message) ? body.message[0] : body.message;
          console.error('→ detail', first);
        }
      }
    });

    /* mic loudness (SDK “volume” event – not yet typed) */
    // @ts-ignore – volume missing from d.ts
    vapi.on('volume', (v: number) => setAmp(v));

    vapi.on('call-start', () => setStatus('calling'));
    vapi.on('call-end',   () => setStatus('ended'));

    /* final transcripts only (handles camel- and snake-case flags) */
    vapi.on('message', (m) => {
      if (
        m.type === 'transcript' &&
        ((m as any).isFinal || (m as any).is_final)
      ) {
        console.log('TRANSCRIPT FINAL:', m.role, m.transcript); // debug
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












