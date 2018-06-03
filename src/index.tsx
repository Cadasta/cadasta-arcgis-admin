import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./app/App";
import { store } from "./app/reducers";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

// TODO: Sync store with localstorage to persist through refreshes
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
