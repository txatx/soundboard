import { useEffect, useMemo, useRef, useState } from "react";

import { createSound, setMasterVolume } from "./audioEngine";

export function useAudio(file, options = {}) {
  const [loaded, setLoaded] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoaded(false);

      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current = null;
      }

      if (!file) {
        return;
      }

      const realFile = await file.handle.getFile();
      const arrayBuffer = await realFile.arrayBuffer();
      const buffer = await new AudioContext().decodeAudioData(arrayBuffer);

      if (cancelled) {
        return;
      }

      const sound = createSound(buffer);

      if (options.initialVolume != null) {
        sound.setVolume(options.initialVolume);
      }
      if (options.initialLoop != null) {
        sound.setLoop(options.initialLoop);
      }

      soundRef.current = sound;
      setLoaded(true);
    }

    load();

    return () => {
      cancelled = true;
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current = null;
      }
    };
  }, [file, options.initialLoop, options.initialVolume]);

  const api = useMemo(() => {
    return {
      loaded,
      play: () => soundRef.current?.play(),
      stop: () => soundRef.current?.stop(),
      setVolume: v => soundRef.current?.setVolume(v),
      setLoop: loop => soundRef.current?.setLoop(loop),
      getIsPlaying: () => soundRef.current?.getIsPlaying() ?? false,
      getDuration: () => soundRef.current?.getDuration() ?? 0,
      getElapsedTime: () => soundRef.current?.getElapsedTime() ?? 0
    };
  }, [loaded]);

  return api;
}

export function useMasterVolume() {
  return {
    setMasterVolume
  };
}
