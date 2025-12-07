import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";

import { BANK } from "app_constants";
import { useAudio } from "utils/audio/hooks";
import { getCssColor, getHexToRgb } from "utils/css";

import Icon from "./Icon";

const BankItem = props => {
  const { file } = props;
  const {
    getDuration,
    getElapsedTime,
    getIsPlaying,
    isFadeIn,
    isFadeOut,
    loop,
    play,
    setFadeIn,
    setFadeOut,
    setLoop,
    setTimeFormat,
    setVolume,
    stop,
    timeFormat,
    volume
  } = useAudio(file);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const progressRef = useRef();

  useEffect(() => {
    if (loop === BANK.LOOP_SETTINGS.NONE && progress >= 100) {
      resetProgress();
    }
  }, [progress]);

  function getFormatedElasedTime() {
    const duration = getDuration();
    const elapsed = elapsedTime;

    let timeToShow;
    if (timeFormat === BANK.TIME_FORMATS.ELAPSED) {
      timeToShow = elapsed;
    } else {
      timeToShow = -duration + elapsed;
    }

    const minutes = Math.floor(Math.abs(timeToShow) / 60);
    const seconds = Math.floor(Math.abs(timeToShow) % 60);

    return `${timeToShow < 0 ? "-" : " "}${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function startProgress() {
    const duration = getDuration();
    const refreshRate = 30; // in ms
    const totalTicks = duration * 1000 / refreshRate;
    const progressIncrement = 100 / totalTicks;

    progressRef.current = setInterval(() => {
      const elapsed = getElapsedTime();
      setElapsedTime(elapsed);
      setProgress(prev => (prev >= 100 ? 0 : prev + progressIncrement));
    }, 30);
  }

  function resetProgress() {
    clearInterval(progressRef.current);
    progressRef.current = null;
    setProgress(0);
    setElapsedTime(0);
  }

  function handleClick(ev) {
    const isPlayingNow = getIsPlaying();

    if (isPlayingNow) {
      stop();
      resetProgress();
      return;
    } else {
      startProgress();
      play();
    }
  }

  function handleTimeClick(ev) {
    ev.stopPropagation();
    const newTimeFormat =
      timeFormat === BANK.TIME_FORMATS.ELAPSED ? BANK.TIME_FORMATS.REMAINING : BANK.TIME_FORMATS.ELAPSED;
    setTimeFormat(newTimeFormat);
  }

  function handleRangeChange(ev) {
    ev.stopPropagation();
    const value = ev.target.value;
    setVolume(value / 100);
  }

  function handleLoopClick(ev) {
    ev.stopPropagation();
    const isLooping = loop === BANK.LOOP_SETTINGS.LOOP;
    const newSetting = isLooping ? BANK.LOOP_SETTINGS.NONE : BANK.LOOP_SETTINGS.LOOP;
    setLoop(newSetting);
  }

  function handleFadeInClick(ev) {
    ev.stopPropagation();
    setFadeIn(!isFadeIn);
  }

  function handleFadeOutClick(ev) {
    ev.stopPropagation();
    setFadeOut(!isFadeOut);
  }

  function handleNoClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  const formatedName = file.name.replace(/\..*/, "");

  const colorName = BANK.SOUND_TYPES_COLORS[file.type];
  const colorHex = getCssColor(colorName);
  const colorRgb = getHexToRgb(colorHex);

  const formatedElapsedTime = getFormatedElasedTime();

  return (
    <div
      className="sb-bank-item"
      onClick={handleClick}
      style={{
        "--progress": progress,
        "--color": `${colorRgb}`
      }}
    >
      <div className="sb-bank-item__title">{formatedName}</div>
      <div className="sb-bank-item__toolbar">
        <div className="sb-bank-item__toolbar-buttons">
          <Button onClick={handleFadeInClick} size="sm" variant={isFadeIn ? colorName : "outline-light"}>
            <Icon color="secondary" icon="arrow-trend-up" size={14} />
          </Button>
          <Button onClick={handleFadeOutClick} size="sm" variant={isFadeOut ? colorName : "outline-light"}>
            <Icon color="secondary" icon="arrow-trend-down" size={14} />
          </Button>
          <Button
            onClick={handleLoopClick}
            size="sm"
            variant={loop === BANK.LOOP_SETTINGS.NONE ? "outline-light" : colorName}
          >
            <Icon color="secondary" icon="repeat" size={14} />
          </Button>
        </div>
        <div className="sb-bank-item__toolbar-controls">
          <div className="sb-bank-item__time" onClick={handleTimeClick}>
            {formatedElapsedTime}
          </div>
          <Form.Range
            color={colorName}
            onChange={handleRangeChange}
            onClick={handleNoClick}
            style={{
              "--range-thumb-color": `${colorRgb}`,
              "--range-track-color": `${colorRgb}`,
              "--range-thumb-size": "16px",
              "--range-track-size": "4px"
            }}
            value={volume * 100}
          />
        </div>
      </div>
    </div>
  );
};

BankItem.propTypes = {
  file: PropTypes.object.isRequired
};

export default BankItem;
