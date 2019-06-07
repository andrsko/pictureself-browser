import React, { Component } from "react";
import { Message, Image } from "semantic-ui-react";
import "./styles.css";

class NotFoundPage extends Component {
  render() {
    return (
      <div>
        <div className="not-found-page">
          <p>This page isn't available.</p>
        </div>
      </div>
    );
  }
}
export default NotFoundPage;
