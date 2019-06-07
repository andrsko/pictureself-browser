import React, { Component } from "react";
import { connect } from "react-redux";
import Register from "../../components/register";
import { register } from "../../actions";
import { Redirect } from "react-router-dom";

class RegisterModal extends Component {
  componentWillMount() {
    if (this.props.isAuthenticated) {
      this.props.handleClose();
    }
  }

  render() {
    const {
      isAuthenticated,
      isLoading,
      error,
      handleRegister,
      showLogInPage,
      from
    } = this.props;

    return isAuthenticated ? (
      <Redirect to={from} />
    ) : (
      <Register
        handleRegister={handleRegister}
        showLogin={showLogInPage}
        isLoading={isLoading}
        error={error}
      />
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.register.error,
  isLoading: state.register.isLoading
});

const mapDispatchToProps = dispatch => ({
  handleRegister: data => {
    dispatch(register(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterModal);
