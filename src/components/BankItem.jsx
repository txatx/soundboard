import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

const BankItem = props => {
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

  function handleClick() {
    progressRef.current = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 30);
  }

  return (
    <div
      className="sb-bank-item"
      onClick={handleClick}
      style={{
        "--progress": progress
      }}
    >
      <div className="sb-bank-item__title">Title</div>
      <div className="sb-bank-item__toolbar">Holis</div>
    </div>
  );
};

BankItem.propTypes = {};

export default BankItem;
