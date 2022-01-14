import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";

import reducers from "./reducers";
import App from "./components/App";
import Welcome from "./components/Welcome";
import SignUp from "./components/auth/SignUp";

//apply middleware call
const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Welcome />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
