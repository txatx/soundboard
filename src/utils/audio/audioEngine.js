let audioContext = null;
let masterGain = null;

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(audioContext.destination);
  }
  return audioContext;
}

export function setMasterVolume(value) {
  const ctx = ensureAudioContext();
  if (!masterGain) {
    return;
  }
  masterGain.gain.setTargetAtTime(value, ctx.currentTime, 0.01);
}

export function createSound(buffer) {
  const ctx = ensureAudioContext();
  const gainNode = ctx.createGain();
  gainNode.gain.value = 1; // initial volume per sound
  gainNode.connect(masterGain);

  let currentSource = null;
  let currentLoop = false;

  function play() {
    if (currentSource) {
      currentSource.stop();
      currentSource.disconnect();
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = currentLoop;
    source.connect(gainNode);
    source.start();
    currentSource = source;

    source.onended = () => {
      if (currentSource === source) {
        currentSource = null;
      }
    };
  }

  function stop() {
    if (currentSource) {
      currentSource.stop();
      currentSource.disconnect();
      currentSource = null;
    }
  }

  function setVolume(v) {
    gainNode.gain.setTargetAtTime(v, ctx.currentTime, 0.01);
  }

  function setLoop(loop) {
    currentLoop = loop;
    if (currentSource) {
      currentSource.loop = loop;
    }
  }

  function getIsPlaying() {
    return !!currentSource;
  }

  function getDuration() {
    return buffer.duration;
  }

  return {
    play,
    stop,
    setVolume,
    setLoop,
    getIsPlaying,
    getDuration
  };
}
