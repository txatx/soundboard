import PropTypes from "prop-types";

import BankItem from "components/BankItem";
import PageHeader from "components/PageHeader";

const Home = props => {
  return (
    <>
      <PageHeader />
      <main>
        <div className="sb-bank">
          <div className="sb-bank-items">
            <BankItem />
            <BankItem />
            <BankItem />
          </div>
        </div>
      </main>
    </>
  );
};

Home.propTypes = {};

export default Home;
