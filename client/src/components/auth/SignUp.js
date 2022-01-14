import React from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
//compose function allows us to write out multiple higher-order components with a cleaner syntax
import { compose } from "redux";
import * as actions from "../../actions";
import { useNavigate } from "react-router-dom";

class SignUp extends React.Component {
  onSubmit = (formProps) => {
    this.props.signup(formProps, () => {
      this.props.history.push("/feature");
    });
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
          <div>{this.props.errorMessage}</div>
          <button>Sign Up!</button>
        </form>
      </div>
    );
  }
}
//need to wire up redux form along with connect helper
//herlper function provided by redux

function mapStateToProps(state) {
  return { errorMessage: state.auth.errorMessage };
}

//compose allows us to apply multiple higher-order components to a single component with a cleaner syntax
export default compose(
  //list out all higher order components that we want to be applied to signup
  //null, as there are no pieces of state we want to wire up - NOW THERE IS = mapStateToProps
  //second argu
  connect(mapStateToProps, actions),
  reduxForm({ form: "signup" })
)(SignUp);
