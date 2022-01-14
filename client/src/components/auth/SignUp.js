import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";

class SignUp extends Component {
  onSubmit = (formProps) => {
    console.log(formProps);
  };

  render() {
    //when we use redux form, we get a funciton on our props object called handleSubmit which takes email/password out of the form
    const { handleSubmit } = this.props;

    return (
      <div>
        {/* no parens after onSubmit because we are calling a reference to the function */}
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <fieldset>
            <label>Email</label>
            <Field
              name="email"
              type="text"
              component="input"
              autoComplete="none"
            />
          </fieldset>
          <fieldset>
            <label>Password</label>
            <Field
              name="password"
              type="password"
              component="input"
              autoComplete="none"
            />
          </fieldset>
          <button>Sign Up!</button>
        </form>
      </div>
    );
  }
}

export default reduxForm({ form: "signup" })(SignUp);
