import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Button, Popup, Menu } from "semantic-ui-react";

import "./styles.css";

class Help extends Component {
  render() {
    const layersExampleTitles = [
      "square face shape",
      "mouth",
      "nose",
      "green eyes",
      "eyebrows",
      "glasses",
      "hait",
      "hat"
    ];
    const layersExample = layersExampleTitles.reverse().map((title, index) => (
      <p
        style={{
          margin: "auto",
          "margin-bottom": "5px",
          "text-align": "center",
          width: "350px",
          "border-style": index == 4 || index == 7 ? "solid" : "dashed",
          "border-width": "1px"
        }}
      >
        {title} layer
      </p>
    ));
    return (
      <div>
        <p id="help-title">Help</p>
        <p id="help-howitworks-title">How It Works</p>
        <p id="help-howitworks">
          A <b>pictureself</b> consists of customizable layers represented
          through <b>features</b>.
          <br />
          For example, "face shape" + "mouth" + "nose" + "eyes" + "eyebrows" +
          "glasses" + "hair" + "hat".
          <br />
          <br />A feature can have different implementations - <b>variants</b>:
          "face shape" - ["round", "oval", "square" etc.], "eyes" -
          ["brown","blue","green" etc.]
          <br />
          <br /> Implementation depends on <b>customization</b> performed by a
          user.
          <br />
          So if a user choses, for example, "face shape" as "square" and "eyes"
          as "green" the pictureself will be composed as follows:
          <br />
          <br />
          <p style={{ "text-align": "center" }}>{layersExample}</p>
          <br />
          Including a feature in different pictureselfs(surprised, angry, happy
          etc.) means different implementation with the same customization.{" "}
          <br />
          Thus if a user have already chosen "green"for "eyes" feature - in the
          pictureself that represents, for example, a surprised state -
          customization remains - eyes would be green but widened.
          <br />
          This means that the creator includes feature and provides
          corresponding variants in the same order: for eyes that would be brown
          widened, blue widened, green widened.
          <br />
          <br />
          In general, a feature is just the index of the variant chosen by a
          user. So if a user chooses green that means that whenever this feature
          is included in other pictureselfs for this particular user the variant
          number 3 would be displayed.
          <br /> <br />
          If implementation of included feature should be the same as in the
          original pictureself "import variants" checkbox can be used to import
          corresponding images.
        </p>
      </div>
    );
  }
}

export default withRouter(Help);
