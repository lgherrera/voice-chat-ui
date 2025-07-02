import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

/**
 * React hook that:
 *  • bootstraps a Vapi client
 *  • exposes start()/stop() helpers
 *  • streams live mic amplitude (0-1) for UI animation
 */
export function useVapi(apiKey: string, assistantId: string) {
  // give useRef an initial null so strict mode is happy
  const vapiRef = useRef<Vapi | null>(null);

  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'calling' | 'ended'>('idle');
  const [amp, setAmp] = useState(0); // live mic RMS

  /* ───────────────  Init Vapi once  ─────────────── */
  useEffect(() => {
    vapiRef.current = new Vapi(apiKey);

    vapiRef.current.on('call-start', () => setStatus('calling'));
    vapiRef.current.on('call-end',   () => setStatus('ended'));
    vapiRef.current.on('message', (m) => {
      if (m.type === 'transcript') {
        setTranscripts((t) => [...t, `${m.role}: ${m.transcript}`]);
      }
    });

    return () => vapiRef.current?.stop();
  }, [apiKey]);

  /* ─────  Mic amplitude for live-pulsing rings  ──── */
  const initAmplitude = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    const data = new Uint8Array(analyser.frequencyBinCount);

    ctx.createMediaStreamSource(stream).connect(analyser);

    const tick = () => {
      analyser.getByteTimeDomainData(data);
      const rms = Math.sqrt(
        data.reduce((s, v) => {
          const val = (v - 128) / 128;
          return s + val * val;
        }, 0) / data.length
      );
      setAmp(rms);
      requestAnimationFrame(tick);
    };
    tick();
  }, []);

  /* ─────────────────  public helpers  ────────────── */
  const start = async () => {
    await initAmplitude();
    vapiRef.current?.start(assistantId);
  };

  const stop = () => {
    vapiRef.current?.stop();
    setStatus('ended');
  };

  return { start, stop, transcripts, status, amp };
}



