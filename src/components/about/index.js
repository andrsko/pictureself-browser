import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Button, Popup, Menu } from "semantic-ui-react";

import "./styles.css";

class About extends Component {
  render() {
    return (
      <div>
        <p id="about-title">About</p>
        <p id="about-text">Pictureself - Customizable Stickers</p>
      </div>
    );
  }
}

export default withRouter(About);
