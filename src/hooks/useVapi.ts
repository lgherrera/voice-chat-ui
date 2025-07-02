import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

/**
 * Hook that:
 * ─ bootstraps the Vapi client
 * ─ exposes start/stop helpers
 * ─ streams live mic amplitude for UI animation
 * ─ logs any Vapi-side errors to the console
 */
export function useVapi(apiKey: string, assistantId: string) {
  // hold the client instance; strict-mode friendly
  const vapiRef = useRef<Vapi | null>(null);

  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'calling' | 'ended'>('idle');
  const [amp, setAmp] = useState(0); // mic RMS 0-1

  /* ─────────── initialise Vapi once ─────────── */
  useEffect(() => {
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    /* 🔴 catch anything the SDK considers an error */
    vapi.on('error', (err) => {
      // err → { action, errorMsg, error, callClientId }
      console.error('[Vapi error]', err);
    });

    vapi.on('call-start', () => setStatus('calling'));
    vapi.on('call-end',   () => setStatus('ended'));
    vapi.on('message', (m) => {
      if (m.type === 'transcript') {
        setTranscripts((t) => [...t, `${m.role}: ${m.transcript}`]);
      }
    });

    /* tidy up when the component unmounts */
    return () => vapi.stop();
  }, [apiKey]);

  /* ───── stream mic amplitude for the pulsing rings ───── */
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

  /* ───────── public helpers ───────── */
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




