import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

/**
 * useVapi
 * ─────────────────────────────────────────
 * • start()/stop() helpers for voice
 * • sendText()  → push typed user messages
 * • amp         → live mic loudness (0-1)
 * • status      → 'idle' | 'calling' | 'ended'
 * • transcripts → combined voice + text history
 */
export function useVapi(apiKey: string, assistantId: string) {
  const vapiRef = useRef<Vapi | null>(null);

  /* reactive state for the UI */
  const [amp,         setAmp]         = useState(0);
  const [status,      setStatus]      =
    useState<'idle' | 'calling' | 'ended'>('idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);

  /* ───────── initialise once ───────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    // live mic loudness (event not typed yet)
    // @ts-ignore
    vapi.on('volume', (v: number) => setAmp(v));

    vapi.on('call-start', () => setStatus('calling'));
    vapi.on('call-end',   () => setStatus('ended'));

    /* speech + textual replies */
    vapi.on('message', (m) => {
      const o = m as any;

      /* assistant plain-text reply */
      if ((o.type === 'assistant' || o.type === 'assistant_response') && o.text) {
        setTranscripts(t => [...t, `assistant: ${o.text}`]);
      }

      /* final speech transcripts (user or assistant) */
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

  /** push a typed user message into the active conversation */
  const sendText = (raw: string) => {
    const content = raw.trim();
    if (!content) return;

    // local echo
    setTranscripts(t => [...t, `user: ${content}`]);

    // forward to Vapi – cast bypasses outdated typings
    (vapiRef.current as any)?.send({
      type: 'user',
      text: content,
    });
  };

  return { start, stop, sendText, amp, status, transcripts };
}
















