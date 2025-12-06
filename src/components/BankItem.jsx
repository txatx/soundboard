import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";

import { BANK } from "app_constants";
import { useAudio } from "utils/audio/hooks";
import { getCssColor, getHexToRgb } from "utils/css";

const BankItem = props => {
  const { file } = props;
  const { getDuration, getIsPlaying, isPlaying, play, setLoop, setVolume, stop } = useAudio(file);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef();

  useEffect(() => {
    if (progress >= 100) {
      resetProgress();
    }
  }, [progress]);

  function resetProgress() {
    clearInterval(progressRef.current);
    progressRef.current = null;
    setProgress(0);
  }

  function handleClick(ev) {
    const isPlayingNow = getIsPlaying();

    if (isPlayingNow) {
      stop();
      resetProgress();
      return;
    } else {
      const duration = getDuration();
      const refreshRate = 30; // in ms
      const totalTicks = duration * 1000 / refreshRate;
      const progressIncrement = 100 / totalTicks;

      progressRef.current = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + progressIncrement));
      }, 30);

      play();
    }
  }

  function handleRangeChange(ev) {
    ev.stopPropagation();
    const value = ev.target.value;
    setVolume(value / 100);
  }

  function handleNoClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  const colorName = BANK.SOUND_TYPES_COLORS[file.type];
  const colorHex = getCssColor(colorName);
  const colorRgb = getHexToRgb(colorHex);

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
        <div className="">00:00</div>
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
      </div>
    </div>
  );
};

BankItem.propTypes = {
  file: PropTypes.object.isRequired
};

export default BankItem;
