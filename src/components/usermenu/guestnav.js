import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import "./styles.css";
import NavLink from "../navlink";

class GuestNav extends Component {
  render() {
    const { showLogin, showRegister } = this.props;
    return (
      <div className="guestMenu">
        <Button
          style={{
            "background-color": "transparent",
            "font-family": '"Arial", Helvetica, sans-serif',
            "font-weight": "normal",
            "font-size": "14px",
            margin: "0",
            color: "rgb(55,55,55)",

            border: "1px solid rgb(215,215,215)"
          }}
          content="Log in"
          size="large"
          id="btn-log-in"
          onClick={showLogin}
          compact
        />
        <Button
          style={{
            "background-color": "transparent",
            "font-family": '"Arial", Helvetica, sans-serif',
            "font-weight": "normal",
            "font-size": "14px",
            margin: "0",
            color: "rgb(55,55,55)"
          }}
          id="btn-sign-up"
          content="Sign up"
          size="large"
          onClick={showRegister}
        />
      </div>
    );
  }
}

export default GuestNav;
