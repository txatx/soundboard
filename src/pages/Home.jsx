import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { BANK } from "app_constants";
import BankItem from "components/BankItem";
import PageHeader from "components/PageHeader";
import { getFileList } from "utils/storage";

const Home = props => {
  const [bankItems, setBankItems] = useState([]);

  useEffect(() => {
    fetchFileList();
  }, []);

  function fetchFileList() {
    getFileList().then(files => {
      setBankItems(files);
    });
  }

  return (
    <>
      <PageHeader />
      <main className="d-flex flex-column gap-8">
        <div className="sb-bank">
          <div className="sb-bank-title">Música</div>
          <div className="sb-bank-items">
            {bankItems
              .filter(file => file.type === BANK.SOUND_TYPES.MUSIC)
              .map((file, index) => (
                <BankItem key={index} file={file} />
              ))}
          </div>
        </div>
        <div className="sb-bank">
          <div className="sb-bank-title">Efectos</div>
          <div className="sb-bank-items">
            {bankItems
              .filter(file => file.type === BANK.SOUND_TYPES.FX)
              .map((file, index) => (
                <BankItem key={index} file={file} />
              ))}
          </div>
        </div>
      </main>
    </>
  );
};

Home.propTypes = {};

export default Home;
