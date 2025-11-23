import { Provider } from "react-redux";

import store from "store";

import Router from "./Router";

const Setup = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default Setup;
