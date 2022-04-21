import ReactDOM from "react-dom";
import React from "react";
import { App } from "./react/app";

import "./style.css";
import "@arco-design/web-react/dist/css/arco.css";

const root = document.getElementById("app");

ReactDOM.render(<App />, root);
