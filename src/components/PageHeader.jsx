import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import { getIsPermissionGranted, getIsWorkingDirectorySet, setWorkingDirectory } from "utils/db";

import Icon from "./Icon";

const PageHeader = props => {
  const [isWorkingDirectorySet, setIsWorkingDirectorySet] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    async function checkWorkingDirectory() {
      const isDirectorySet = await getIsWorkingDirectorySet();
      const isPermission = await getIsPermissionGranted();
      setIsWorkingDirectorySet(isDirectorySet);
      setIsPermissionGranted(isPermission);
    }

    checkWorkingDirectory();
  }, []);

  async function handleImportClick() {
    await setWorkingDirectory();
  }

  const buttonColor = !isWorkingDirectorySet ? "danger" : !isPermissionGranted ? "warning" : "primary";

  return (
    <header>
      <div className="sb-header-content">
        <h1>Soundboard</h1>
        <Button onClick={handleImportClick} variant={buttonColor}>
          <Icon className="me-2" icon="folder-open" size={16} />
          Cambiar directorio de trabajo
        </Button>
      </div>
    </header>
  );
};

PageHeader.propTypes = {};

export default PageHeader;
