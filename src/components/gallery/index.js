import React, { Component } from "react";
import "./styles.css";
import StackGrid from "react-stack-grid";
import { Link } from "react-router-dom";
import { imageComposer } from "../../utils/imagecomposer";
import Loader from "../loader";

export default class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canvasDataURLs: [],
      widths: [],
      heights: [],
      nImagesComposed: 0
    };
  }

  componentDidMount() {
    const { pictureselfs } = this.props;
    for (let i = 0; i < pictureselfs.length; ++i) {
      imageComposer(pictureselfs[i].image_urls)
        .then(composedImage => {
          this.setState(state => {
            let newCanvasDataURLs = [...state.canvasDataURLs];
            let newWidths = [...state.widths];
            let newHeights = [...state.heights];

            newCanvasDataURLs[i] = composedImage.url;
            newWidths[i] = composedImage.width;
            newHeights[i] = composedImage.height;

            return {
              canvasDataURLs: newCanvasDataURLs,
              widths: newWidths,
              heights: newHeights,
              imagesComposed: state.imagesComposed + 1
            };
          });
        })
        .catch(error => {
          alert(error);
        });
    }
  }

  render() {
    const { pictureselfs, columnWidth, channel } = this.props;

    const { canvasDataURLs, widths, heights, nImagesComposed } = this.state;

    let box_shadow_heights = {};

    for (let i = 0; i < pictureselfs.length; ++i) {
      if (widths[i] !== undefined) {
        box_shadow_heights[pictureselfs[i].id] =
          widths[i] > columnWidth
            ? heights[i] * (columnWidth / widths[i])
            : heights[i] + (columnWidth - widths[i]);
      }
    }

    var pCards = [];
    for (let i = 0; i < pictureselfs.length; ++i) {
      const canvasDataURL = canvasDataURLs[i];
      if (canvasDataURL !== undefined) {
        let pictureself = pictureselfs[i];
        pCards.push(
          <div key={pictureself.id.toString()}>
            <Link to={`/p/${pictureself.id.toString()}/`}>
              <div
                style={{
                  width: columnWidth.toString() + "px",
                  "box-shadow":
                    "0px " +
                    box_shadow_heights[pictureself.id].toString() +
                    "px inset rgba(175,175,175,0.075)"
                }}
              >
                <img
                  src={canvasDataURL}
                  alt={pictureself.title}
                  style={{
                    "max-width": "100%",
                    height: "auto",
                    margin:
                      columnWidth > widths[i]
                        ? (columnWidth - widths[i]) / 2
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
                className="gallery title"
                style={{
                  width: columnWidth - 10 + "px",
                  "margin-left": "5px"
                }}
              >
                {pictureself.title}
              </p>
            </Link>

            {channel ? null : (
              <Link to={`/${pictureself.username}/`}>
                <p
                  title={pictureself.name}
                  className="gallery channel"
                  style={{
                    width: columnWidth - 10 + "px",
                    "margin-left": "5px"
                  }}
                >
                  {pictureself.name}
                </p>
              </Link>
            )}
          </div>
        );
      }
    }

    const isLoading = nImagesComposed === pictureselfs.length;

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
        <div
          style={{
            "margin-top": "35px",
            visibility: isLoading ? "visible" : "hidden"
          }}
        >
          <Loader />
        </div>
      </div>
    );
  }
}
