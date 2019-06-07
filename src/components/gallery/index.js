import React, { Component } from "react";
import "./styles.css";
import StackGrid from "react-stack-grid";
import { Link } from "react-router-dom";

export default class Gallery extends Component {
  render() {
    let box_shadow_heights = {};

    let i;
    const { pictureselfs } = this.props;
    for (i = 0; i < pictureselfs.length; i++) {
      const pictureself = pictureselfs[i];
      box_shadow_heights[pictureself.id] =
        pictureself.width_height[0] > this.props.columnWidth
          ? pictureselfs[i].width_height[1] *
            (this.props.columnWidth / pictureself.width_height[0])
          : pictureselfs[i].width_height[1] +
            (this.props.columnWidth - pictureself.width_height[0]);
    }

    const pCards = pictureselfs.map((pictureself, index) => (
      <div key={pictureself.id.toString()}>
        <Link to={`/p/${pictureself.id.toString()}/`}>
          <div
            style={{
              width: this.props.columnWidth.toString() + "px",
              "box-shadow":
                "0px " +
                box_shadow_heights[pictureself.id].toString() +
                "px inset rgba(175,175,175,0.075)"
            }}
          >
            <img
              src={`data:image/${pictureself.ext};base64,${
                pictureself.encoding
              }`}
              alt={pictureself.title}
              style={{
                "max-width": "100%",
                height: "auto",
                margin:
                  this.props.columnWidth > pictureself.width_height[0]
                    ? (this.props.columnWidth - pictureself.width_height[0]) / 2
                    : 0 + "px",

                "z-index": "-1",
                position: "relative"
              }}
            />
          </div>
        </Link>

        <Link to={`/p/${pictureself.id.toString()}/`}>
          <p
            title={pictureself.title}
            class="gallery title"
            style={{
              width: this.props.columnWidth - 10 + "px",
              "margin-left": "5px"
            }}
          >
            {pictureself.title}
          </p>
        </Link>

        {this.props.channel ? null : (
          <Link to={`/${pictureself.username}/`}>
            <p
              title={pictureself.name}
              class="gallery channel"
              style={{
                width: this.props.columnWidth - 10 + "px",
                "margin-left": "5px"
              }}
            >
              {pictureself.name}
            </p>
          </Link>
        )}
      </div>
    ));

    return (
      <div>
        <br />
        <StackGrid
          monitorImagesLoaded={true}
          columnWidth={this.props.columnWidth}
          gutterWidth={this.props.gutterWidth}
          gutterHeight={this.props.gutterHeight + 5}
          duration={0}
        >
          {pCards}
        </StackGrid>
      </div>
    );
  }
}
