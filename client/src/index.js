import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./components/App";
import Welcome from "./components/Welcome";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Welcome />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
