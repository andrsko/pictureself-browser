import React, { Component } from "react";
import { connect } from "react-redux";
import Login from "../../components/login";
import { login } from "../../actions";
import { Redirect } from "react-router-dom";

class LoginModal extends Component {
  render() {
    const {
      isAuthenticated,
      isLoading,
      error,
      showRegisterPage,
      handleLogin,
      from
    } = this.props;
    return isAuthenticated ? (
      <Redirect to={from} />
    ) : (
      <Login
        handleLogin={handleLogin}
        showRegister={showRegisterPage}
        isLoading={isLoading}
        error={error}
      />
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.auth.isLoading,
  error: state.auth.error,
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  handleLogin: (username, password) => {
    dispatch(login(username, password));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);
