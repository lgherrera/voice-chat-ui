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

    // @ts-ignore volume not typed yet
    vapi.on('volume', (v: number) => setAmp(v));
    vapi.on('call-start', () => setStatus('calling'));
    vapi.on('call-end',   () => setStatus('ended'));

    vapi.on('message', (m) => {
      console.log('[Vapi message]', m);
      const o = m as any;

      /* assistant textual reply */
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
  
  // 👇 UPDATED: Accepts an optional 'options' object (for metadata)
  const start = (options?: any) => vapiRef.current?.start(assistantId, options);
  
  const stop  = () => vapiRef.current?.stop();

  /** Send typed user message; start session if needed, then say() */
  const sendText = async (raw: string) => {
    const text = raw.trim();
    if (!text) return;

    setTranscripts(t => [...t, `user: ${text}`]);   // local echo

    // ensure we have a session
    if (status === 'idle') {
      // Note: If you want text-started sessions to also have a chatId, 
      // you would need to fetch it here too. For now, this defaults to basic start.
      await vapiRef.current?.start(assistantId);    
      setStatus('calling');
    }

    // say() triggers assistant reasoning + reply
    (vapiRef.current as any)?.say(text);
  };

  return { start, stop, sendText, amp, status, transcripts };
}






















