import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

export function useVapi(apiKey: string, assistantId: string) {
  const vapiRef = useRef<Vapi | null>(null);

  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'calling' | 'ended'>('idle');
  const [amp, setAmp] = useState(0);                   // ← now comes from SDK

  /* ───────── init once ───────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    vapi.on('error',  (e) => console.error('[Vapi error]', e));
    vapi.on('volume', (v) => setAmp(v));               // ★ live mic level
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
  const start = () => vapiRef.current?.start(assistantId, {
    /** optional: give yourself more time to speak (ms) */
    timeoutToCustomerSpeechMs: 12000,
  });

  const stop  = () => vapiRef.current?.stop();

  return { start, stop, transcripts, status, amp };
}





