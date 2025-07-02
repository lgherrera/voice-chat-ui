import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

/**
 * React hook that:
 * • boots a Vapi client
 * • exposes start() / stop()
 * • streams mic volume (0–1) for UI animation
 * • logs SDK errors and mic levels to the console
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

    /* log any SDK-level errors */
    vapi.on('error', (err) => console.error('[Vapi error]', err));

    /* non-typed “volume” event — fires ~10×/sec */
    // @ts-ignore: not yet in the SDK’s type definitions
    vapi.on('volume', (v: number) => {
      console.log('mic level', v);   // DEBUG: should rise when you speak
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
    // Cast to any so we can pass the silence-timeout override
    (vapiRef.current as any)?.start(assistantId, {
      timeoutToCustomerSpeechMs: 15000,  // 15-second grace period
    });
  };

  const stop = () => vapiRef.current?.stop();

  return { start, stop, amp, status, transcripts };
}








