import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

library.add(fas);

const Icon = props => {
  const { className = "", color = "", icon, size = 24 } = props;

  return (
    <FontAwesomeIcon
      className={className}
      icon={`fa-${icon}`}
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
