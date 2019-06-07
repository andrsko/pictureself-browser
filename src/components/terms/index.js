import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Button, Popup, Menu } from "semantic-ui-react";

import "./styles.css";

class Terms extends Component {
  render() {
    return (
      <div>
        <p id="terms-title">Terms</p>
      </div>
    );
  }
}

export default withRouter(Terms);
