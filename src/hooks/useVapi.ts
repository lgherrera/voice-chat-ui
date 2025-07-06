import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

export function useVapi(apiKey: string, assistantId: string) {
  const vapiRef = useRef<Vapi | null>(null);

  /* UI-state */
  const [amp, setAmp] = useState(0);
  const [status, setStatus] =
    useState<'idle' | 'calling' | 'ended'>('idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);

  /* ───────── init once ───────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    // mic loudness
    // @ts-ignore (volume missing in .d.ts)
    vapi.on('volume', (v: number) => setAmp(v));

    vapi.on('call-start', () => setStatus('calling'));
    vapi.on('call-end',   () => setStatus('ended'));

    /* master listener: log + route messages */
    vapi.on('message', (m) => {
      console.log('[Vapi message]', m);           // debug
      const o = m as any;

      /* assistant text reply */
      if (
        (o.type === 'assistant' || o.type === 'assistant_response' ||
         (o.type === 'add-message' && o.role === 'assistant')) &&
        o.text
      ) {
        setTranscripts(t => [...t, `assistant: ${o.text}`]);
      }

      /* final voice transcript */
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

  /** Send a typed user message. Starts a text-only session if needed. */
  const sendText = (raw: string) => {
    const text = raw.trim();
    if (!text) return;

    // local echo
    setTranscripts(t => [...t, `user: ${text}`]);

    // ensure a session exists
    if (status === 'idle') {
      // inputMode:'text' starts a session without grabbing the mic
      (vapiRef.current as any)?.start(assistantId, { inputMode: 'text' });
      setStatus('calling');          // local state
    }

    // send the text message
    (vapiRef.current as any)?.send({ type: 'text', text });
  };

  return { start, stop, sendText, amp, status, transcripts };
}



















