import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";

import { BANK } from "app_constants";
import { useAudio } from "utils/audio/hooks";
import { getCssColor, getHexToRgb } from "utils/css";

import Icon from "./Icon";

const TIME_FORMATS = {
  ELAPSED: "ELAPSED",
  REMAINING: "REMAINING"
};

const LOOP_SETTINGS = {
  SINGLE: "SINGLE",
  LOOP: "LOOP"
};

const BankItem = props => {
  const { file } = props;
  const { getDuration, getElapsedTime, getIsPlaying, isPlaying, play, setLoop, setVolume, stop } = useAudio(file);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeFormat, setTimeFormat] = useState(TIME_FORMATS.ELAPSED);
  const [loopSetting, setLoopSetting] = useState(LOOP_SETTINGS.SINGLE);
  const progressRef = useRef();

  useEffect(() => {
    if (loopSetting === LOOP_SETTINGS.SINGLE && progress >= 100) {
      resetProgress();
    }
  }, [progress]);

  function getFormatedElasedTime() {
    const duration = getDuration();
    const elapsed = elapsedTime;

    let timeToShow;
    if (timeFormat === TIME_FORMATS.ELAPSED) {
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
      setElapsedTime(getElapsedTime());
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
    setTimeFormat(prev => (prev === TIME_FORMATS.ELAPSED ? TIME_FORMATS.REMAINING : TIME_FORMATS.ELAPSED));
  }

  function handleRangeChange(ev) {
    ev.stopPropagation();
    const value = ev.target.value;
    setVolume(value / 100);
  }

  function handleLoopClick(ev) {
    ev.stopPropagation();
    const isLooping = loopSetting === LOOP_SETTINGS.LOOP;

    setLoopSetting(isLooping ? LOOP_SETTINGS.SINGLE : LOOP_SETTINGS.LOOP);
    setLoop(!isLooping);
  }

  function handleNoClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();
  }

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
      <div className="sb-bank-item__title">{file.name}</div>
      <div className="sb-bank-item__toolbar">
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
        />
        <div className="sb-bank-item__loop">
          <Button
            onClick={handleLoopClick}
            size="sm"
            variant={loopSetting === LOOP_SETTINGS.SINGLE ? "outline-light" : colorName}
          >
            <Icon color="white" icon="repeat" size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

BankItem.propTypes = {
  file: PropTypes.object.isRequired
};

export default BankItem;
