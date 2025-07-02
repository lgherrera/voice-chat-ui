import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

/**
 * useVapi — React hook
 * • boots a Vapi client
 * • exposes start()/stop()
 * • streams mic volume (0–1) for ring animation
 * • logs SDK errors, including HTTP status+body for start-method errors
 */
export function useVapi(apiKey: string, assistantId: string) {
  const vapiRef = useRef<Vapi | null>(null);

  const [amp, setAmp] = useState(0);                        // live mic loudness
  const [status, setStatus] =
    useState<'idle' | 'calling' | 'ended'>('idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);

  /* ───────── Initialise once ───────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    /* ⇢ enhanced error listener */
    vapi.on('error', async (e) => {
      console.error('[Vapi error]', e);

      if (e.error instanceof Response) {
        const body =
          (await e.error.clone().json().catch(() => e.error.text())) ?? '(empty)';
        console.error('→ status', e.error.status, body);
        /* Example output:
           → status 403 { message: "Forbidden: origin not allowed" } */
      }
    });

    /* SDK “volume” event (~10×/sec). Not yet typed, so ignore TS check */
    // @ts-ignore
    vapi.on('volume', (v: number) => {
      console.log('mic level', v);      // DEBUG: watch numbers jump when you talk
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

  /* ───────── Helpers ───────── */
  const start = () => {
    // Cast to any so we can pass the silence-timeout override safely
    (vapiRef.current as any)?.start(assistantId, {
      timeoutToCustomerSpeechMs: 15000,   // 15-second grace period
    });
  };

  const stop = () => vapiRef.current?.stop();

  return { start, stop, amp, status, transcripts };
}









