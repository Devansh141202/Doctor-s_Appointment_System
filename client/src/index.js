import React from "react";
import "antd/dist/antd.css";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import TagManager from "react-gtm-module";

const trackingId = {
    gtmId: process.env.REACT_APP_GTMID // Replace with your Google Analytics tracking ID
}
TagManager.initialize(trackingId)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);


reportWebVitals();
