import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Button, Popup, Menu } from "semantic-ui-react";

import "./styles.css";

class Blog extends Component {
  render() {
    return (
      <div>
        <p id="blog-title">Blog</p>
      </div>
    );
  }
}

export default withRouter(Blog);
