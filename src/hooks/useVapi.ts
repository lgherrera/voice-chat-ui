import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

export function useVapi(apiKey: string, assistantId: string) {
  const vapiRef = useRef<Vapi | null>(null);

  /* UI state */
  const [amp, setAmp] = useState(0);
  const [status, setStatus] =
    useState<'idle' | 'calling' | 'ended'>('idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);

  /* ───────── init once ───────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    // @ts-ignore (volume not typed yet)
    vapi.on('volume', (v: number) => setAmp(v));
    vapi.on('call-start', () => setStatus('calling'));
    vapi.on('call-end',   () => setStatus('ended'));

    /* master listener */
    vapi.on('message', (m) => {
      console.log('[Vapi message]', m);          //  ← DEBUG every payload
      const o = m as any;

      /* assistant plain-text replies */
      if (
        (o.type === 'assistant' ||
         o.type === 'assistant_response' ||
         (o.type === 'add-message' && o.role === 'assistant')) &&
        o.text
      ) {
        setTranscripts(t => [...t, `assistant: ${o.text}`]);
      }

      /* final speech transcripts */
      const final =
        o.transcript &&
        (o.transcriptType === 'final' || o.isFinal || o.is_final || o.final);

      if (
        final &&
        (o.type === 'transcript' || o.type === 'assistant_transcript')
      ) {
        setTranscripts(t => [...t, `${o.role}: ${o.transcript}`]);
      }
    });

    return () => vapi.stop();
  }, [apiKey]);

  /* ───────── helpers ───────── */
  const start = () => vapiRef.current?.start(assistantId);
  const stop  = () => vapiRef.current?.stop();

  /** send typed user text to Vapi */
  const sendText = (raw: string) => {
    const text = raw.trim();
    if (!text) return;

    setTranscripts(t => [...t, `user: ${text}`]);          // local echo

    /* official text payload */
    (vapiRef.current as any)?.send({ type: 'text', text });
  };

  return { start, stop, sendText, amp, status, transcripts };
}


















