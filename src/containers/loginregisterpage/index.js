import React, { Component } from "react";
import RegisterPage from "./registerpage";
import LogInPage from "./loginpage";
import store from "../../store";
import { Redirect } from "react-router-dom";

/*
implement redirectToReferrer for PrivateRoute
if redirectToReferrer = null - redirect to DEFAULT_LOGGING_IN_REDIRECT 
*/

export default class LoginRegisterPage extends Component {
  constructor(props) {
    super(props);
    this.showLogInPage = this.showLogInPage.bind(this);
    this.showRegisterPage = this.showRegisterPage.bind(this);

    this.state = {
      userIsRegistered: true // true - show log in page; false - show register page
    };
  }

  showLogInPage = () => {
    this.setState({ userIsRegistered: true });
  };

  showRegisterPage = () => {
    this.setState({ userIsRegistered: false });
  };

  render() {
    let { from } = this.props.location.state || { from: { pathname: "/" } };

    if (this.state.userIsRegistered)
      return <LogInPage showRegisterPage={this.showRegisterPage} from={from} />;
    else return <RegisterPage showLogInPage={this.showLogInPage} from={from} />;
  }
}
