import { useEffect, useRef, useState } from "react";

import { BANK } from "app_constants";
import { setStoredSoundProperty } from "utils/db";

import { createSound, setMasterVolume } from "./audioEngine";

export function useAudio(file) {
  const [loaded, setLoaded] = useState(false);
  const [internalLoop, setInternalLoop] = useState(BANK.LOOP_SETTINGS.NONE);
  const [internalVolume, setInternalVolume] = useState(0);
  const [internalTimeFormat, setInternalTimeFormat] = useState(BANK.TIME_FORMATS.ELAPSED);
  const [internalFadeIn, setInternalFadeIn] = useState(false);
  const [internalFadeOut, setInternalFadeOut] = useState(false);
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
        setInternalVolume(file.volume);
      }
      if (file.loop != null) {
        sound.setLoop(file.loop === BANK.LOOP_SETTINGS.LOOP);
        setInternalLoop(file.loop);
      }
      if (file.timeFormat != null) {
        setInternalTimeFormat(file.timeFormat);
      }
      if (file.fadeIn != null) {
        setInternalFadeIn(file.fadeIn);
      }
      if (file.fadeOut != null) {
        setInternalFadeOut(file.fadeOut);
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
    setInternalVolume(v);
    setStoredSoundProperty(file.id, "volume", v);
  }

  function setLoop(loop) {
    if (loop === BANK.LOOP_SETTINGS.NONE) {
      soundRef.current?.setLoop(false);
    } else if (loop === BANK.LOOP_SETTINGS.LOOP) {
      soundRef.current?.setLoop(true);
    }
    setInternalLoop(loop);
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

  function setTimeFormat(timeFormat) {
    setInternalTimeFormat(timeFormat);
    setStoredSoundProperty(file.id, "timeFormat", timeFormat);
  }

  function setFadeIn(isFadeIn) {
    setInternalFadeIn(isFadeIn);
    setStoredSoundProperty(file.id, "fadeIn", isFadeIn);
  }

  function setFadeOut(isFadeOut) {
    setInternalFadeOut(isFadeOut);
    setStoredSoundProperty(file.id, "fadeOut", isFadeOut);
  }

  return {
    loaded,
    play,
    stop,
    setVolume,
    volume: internalVolume,
    setLoop,
    loop: internalLoop,
    getIsPlaying,
    getDuration,
    getElapsedTime,
    setTimeFormat,
    timeFormat: internalTimeFormat,
    setFadeIn,
    isFadeIn: internalFadeIn,
    setFadeOut,
    isFadeOut: internalFadeOut
  };
}

export function useMasterVolume() {
  return {
    setMasterVolume
  };
}
