import axios from "axios";

import { AUTH_USER } from "./types";

//action creator
export const signup =
  //one function that returns another function


    ({ email, password }) =>
    //return an action
    //action creator is returning a single value (single javascript expression)
    (dispatch) => {
      axios.post("http://localhost:3090/signup", {
        email: email,
        password: password,
      });
    };
