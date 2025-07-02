import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

export function useVapi(apiKey: string, assistantId: string) {
  const vapiRef = useRef<Vapi | null>(null);

  const [amp, setAmp] = useState(0);
  const [status, setStatus] =
    useState<'idle' | 'calling' | 'ended'>('idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);

  /* ───────── initialise once ───────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    /* mic loudness (volume event is untyped) */
    // @ts-ignore
    vapi.on('volume', (v: number) => setAmp(v));

    vapi.on('call-start', () => setStatus('calling'));
    vapi.on('call-end',   () => setStatus('ended'));

    /* ---------- capture FINAL transcripts only ---------- */
    vapi.on('message', (m) => {
      console.log('[Vapi message]', m);          // 👈 full dump for debugging

      const finalFlag =
        (m as any).isFinal || (m as any).is_final || (m as any).final;

      const isTranscriptType = [
        'transcript',
        'assistant',
        'assistant_response',
        'assistant_transcript',
      ].includes((m as any).type);

      if (isTranscriptType && finalFlag) {
        console.log('TRANSCRIPT FINAL:', m.role, m.transcript);
        setTranscripts((t) => [...t, `${m.role}: ${m.transcript}`]);
      }
    });

    return () => vapi.stop();
  }, [apiKey]);

  /* helpers */
  const start = () => vapiRef.current?.start(assistantId);
  const stop  = () => vapiRef.current?.stop();

  return { start, stop, amp, status, transcripts };
}













