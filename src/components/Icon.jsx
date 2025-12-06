import PropTypes from "prop-types";

const Icon = props => {
  const { className = "", color = "", icon, size = 24 } = props;

  return (
    <i
      className={`bi bi-${icon} ${className}`}
      style={{
        "--size": size + "px",
        ...color
          ? {
            "--color": `var(--bs-${color})`
          }
          : {}
      }}
    />
  );
};

Icon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string.isRequired,
  size: PropTypes.string
};

export default Icon;
