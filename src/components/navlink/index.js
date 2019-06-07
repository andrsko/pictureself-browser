import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Button, Popup, Menu } from "semantic-ui-react";

import "./styles.css";

class Navlink extends Component {
  render() {
    return (
      <div className="navlinkContainer">
        <Link to="/">
          <Button
            style={{
              "background-color": "transparent",
              "font-family": '"Arial", Helvetica, sans-serif',
              "font-weight": "normal",
              margin: "0",
              color: "rgb(55,55,55)",
              padding: "10px"
            }}
            content="Home"
            size="large"
          />
        </Link>

        <Link to="/browse">
          <Button
            style={{
              "background-color": "transparent",
              "font-family": '"Arial", Helvetica, sans-serif',
              "font-weight": "normal",
              margin: "0",
              color: "rgb(55,55,55)",
              padding: "10px"
            }}
            content="Browse"
            size="large"
          />
        </Link>
        <Popup
          trigger={
            <Button
              style={{
                "background-color": "transparent",
                "font-family": '"Arial", Helvetica, sans-serif',
                "font-weight": "bold",
                "font-size": "20px",
                margin: "0",
                color: "rgb(55,55,55)",
                padding: "10px"
              }}
              content="⋯"
              size="large"
            />
          }
          flowing
          hoverable
          on="click"
          position="bottom center"
        >
          <Link to="/about">
            <p className="navlink-ellipsis-link">About</p>
          </Link>
          <Link to="/blog">
            <p className="navlink-ellipsis-link">Blog</p>
          </Link>
          <Link to="/terms">
            <p className="navlink-ellipsis-link">Terms</p>
          </Link>
          <Link to="/privacy">
            <p className="navlink-ellipsis-link">Privacy Policy</p>
          </Link>
          <Link to="/help">
            <p className="navlink-ellipsis-link">Help</p>
          </Link>
        </Popup>
      </div>
    );
  }
}

export default withRouter(Navlink);
