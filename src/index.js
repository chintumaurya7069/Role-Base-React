import React from "react";
import ReactDOM from "react-dom/client";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "flatpickr/dist/themes/material_blue.css";
import "./index.css";
import "./Vender.js";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
