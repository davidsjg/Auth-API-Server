import { combineReducers } from "redux";
//herlper we want is called reducer, don't want to have mutliple 'reducer' names
import { reducer as formReducer } from "redux-form";

import auth from "./auth";

export default combineReducers({
  auth,
  //form key required for redux form
  form: formReducer,
});
