import PropTypes from "prop-types";
import { BrowserRouter, Routes, Route } from "react-router";

import Home from "pages/Home";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define your routes here */}
        <Route element={<Home />} path="/" />
      </Routes>
    </BrowserRouter>
  );
};

Router.propTypes = {};

export default Router;
