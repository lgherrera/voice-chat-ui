import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

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

    // mic loudness (volume event is not typed yet)
    // @ts-ignore
    vapi.on('volume', (v: number) => setAmp(v));

    vapi.on('call-start', () => setStatus('calling'));
    vapi.on('call-end',   () => setStatus('ended'));

    /* handle both speech transcripts and assistant text messages */
    vapi.on('message', (m) => {
      const o = m as any;

      /* assistant textual reply */
      if (
        (o.type === 'assistant' || o.type === 'assistant_response') &&
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

  /** send a typed user message into the live conversation */
  const sendText = (text: string) => {
    const content = text.trim();
    if (!content) return;

    // local echo
    setTranscripts(t => [...t, `user: ${content}`]);

    // forward to Vapi
    vapiRef.current?.send({ type: 'user', text: content });
  };

  return { start, stop, sendText, amp, status, transcripts };
}















