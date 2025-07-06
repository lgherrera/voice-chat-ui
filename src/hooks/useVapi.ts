import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

export function useVapi(apiKey: string, assistantId: string) {
  const vapiRef = useRef<Vapi | null>(null);

  /* Reactive state */
  const [amp, setAmp] = useState(0);
  const [status, setStatus] =
    useState<'idle' | 'calling' | 'ended'>('idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);

  /* ───────── initialise once ───────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    // @ts-ignore “volume” not yet typed
    vapi.on('volume', (v: number) => setAmp(v));

    vapi.on('call-start', () => setStatus('calling'));
    vapi.on('call-end',   () => setStatus('ended'));

    /* unified message handler */
    vapi.on('message', (m) => {
      console.log('[Vapi message]', m);
      const o = m as any;

      /* assistant plain-text reply */
      if (
        (o.type === 'assistant' || o.type === 'assistant_response' ||
         (o.type === 'add-message' && o.role === 'assistant')) &&
        o.text
      ) {
        setTranscripts(t => [...t, `assistant: ${o.text}`]);
      }

      /* final speech transcript */
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

  /** Send a typed user message; start a text-only session if necessary */
  const sendText = async (raw: string) => {
    const text = raw.trim();
    if (!text) return;

    setTranscripts(t => [...t, `user: ${text}`]);   // local echo

    if (status === 'idle') {
      const vapi: any = vapiRef.current;

      try {
        // Preferred new flag
        await vapi.start(assistantId, { audio: false });
      } catch {
        try {
          // Legacy flag in some builds
          await vapi.start(assistantId, { voice: false });
        } catch {
          // Fallback (will speak)
          await vapi.start(assistantId);
        }
      }
      setStatus('calling');
    }

    (vapiRef.current as any)?.send({ type: 'text', text });
  };

  return { start, stop, sendText, amp, status, transcripts };
}





















