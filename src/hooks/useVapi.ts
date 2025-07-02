import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

/**
 * useVapi – React hook
 * • boots a Vapi client
 * • exposes start()/stop()
 * • streams mic volume (0–1) for UI animation
 * • logs SDK errors, printing HTTP status & first detail line
 */
export function useVapi(apiKey: string, assistantId: string) {
  const vapiRef = useRef<Vapi | null>(null);

  /* UI state */
  const [amp,         setAmp]         = useState(0);  // live mic loudness
  const [status,      setStatus]      =
    useState<'idle' | 'calling' | 'ended'>('idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);

  /* ───────── Initialise once ───────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    /* ── enhanced error listener ── */
    vapi.on('error', async (e) => {
      console.error('[Vapi error]', e);

      if (e.error instanceof Response) {
        const raw = e.error.clone();
        const body =
          (await raw.json().catch(() => raw.text())) ?? '(empty)';
        console.error('→ status', e.error.status, body);

        // Print the first detail message if present
        if (typeof body === 'object' && body?.message) {
          const first = Array.isArray(body.message) ? body.message[0] : body.message;
          console.error('→ detail', first);
        }
      }
    });

    /* SDK “volume” event (~10×/sec). Not yet typed, so ignore TS check */
    // @ts-ignore – volume isn’t in the SDK’s .d.ts yet
    vapi.on('volume', (v: number) => {
      console.log('mic level', v);     // DEBUG – should rise when you speak
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
  const start = () => vapiRef.current?.start(assistantId);
  const stop  = () => vapiRef.current?.stop();

  return { start, stop, amp, status, transcripts };
}










