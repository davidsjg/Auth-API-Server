import axios from "axios";

import { AUTH_USER, AUTH_ERROR } from "./types";

//action creator
export const signup =
  //one function that returns another function

  //return an action
  //action creator is returning a single value (single javascript expression)


    ({ email, password }) =>
    async (dispatch) => {
      try {
        const response = await axios.post("http://localhost:3090/signup", {
          email: email,
          password: password,
        });

        //pass the action that we want to send to all the middlewares and reducers inside application
        dispatch({
          type: AUTH_USER,
          payload: response.data.token,
        });
      } catch (e) {
        //runs if anything goes wrong when trying to create a new account
        dispatch({ type: AUTH_ERROR, payload: "Email in use" });
      }
    };
