import { useEffect, useMemo, useRef, useState } from "react";

import { setStoredSoundProperty } from "utils/db";

import { createSound, setMasterVolume } from "./audioEngine";

export function useAudio(file) {
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

      if (file.volume != null) {
        sound.setVolume(file.volume);
      }
      if (file.loop != null) {
        sound.setLoop(file.loop);
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
  }, [file]);

  function play() {
    soundRef.current?.play();
  }

  function stop() {
    soundRef.current?.stop();
  }

  function setVolume(v) {
    soundRef.current?.setVolume(v);
    setStoredSoundProperty(file.id, "volume", v);
  }

  function setLoop(loop) {
    soundRef.current?.setLoop(loop);
    setStoredSoundProperty(file.id, "loop", loop);
  }

  function getIsPlaying() {
    return soundRef.current?.getIsPlaying() ?? false;
  }

  function getDuration() {
    return soundRef.current?.getDuration() ?? 0;
  }

  function getElapsedTime() {
    return soundRef.current?.getElapsedTime() ?? 0;
  }

  const api = useMemo(() => {
    return {
      loaded,
      play,
      stop,
      setVolume,
      setLoop,
      getIsPlaying,
      getDuration,
      getElapsedTime
    };
  }, [loaded]);

  return api;
}

export function useMasterVolume() {
  return {
    setMasterVolume
  };
}
