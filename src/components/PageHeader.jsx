import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

import { getFileList } from "utils/storage";

const PageHeader = props => {
  async function handleImportClick() {
    const fileList = await getFileList();
  }

  return (
    <header>
      <div className="sb-header-content">
        <h1>Soundboard</h1>
        <Button onClick={handleImportClick} variant="primary">
          Importar
        </Button>
      </div>
    </header>
  );
};

PageHeader.propTypes = {};

export default PageHeader;
