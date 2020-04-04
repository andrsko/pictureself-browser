import {
  Button,
  Checkbox,
  Form,
  Dropdown,
  Message,
  Icon,
  Modal,
  Header,
} from "semantic-ui-react";
import React, { Component } from "react";
import axios from "axios";
import { getConfig } from "../../utils/config";
import { apiErrorHandler } from "../../utils/errorhandler";
import { imageComposer } from "../../utils/imagecomposer";
import { Link } from "react-router-dom";
import Loader from "../loader";
import StackGrid from "react-stack-grid";
import "./styles.css";
import { API_URL } from "../../api/constants";

export default class Customize extends Component {
  constructor(props) {
    super(props);

    this.handleActiveFeatureChange = this.handleActiveFeatureChange.bind(this);
    this.handleActiveOptionChange = this.handleActiveOptionChange.bind(this);

    this.state = {
      // to do: consider replacing "_ids" and "_titles" with "features" - array of objects
      featureIds: [], //features that have more than 1 variant
      featureTitles: [],
      allFeatureIds: [],
      activeFeatureId: 0,
      activeOptionIndex: -1, // int; -1 = not customized yet: silver border around first option
      customizationVariantImageUrls: [],
      customizationVariantAlts: [],
      featureVariantImageUrls: [],
      featureVariantAlts: [],
      canvasDataURLs: [],
      widths: [],
      heights: [],
      nImagesComposed: 0,
    };
  }

  componentDidMount() {
    const pictureselfId = this.props.id;
    // includes this.handleActiveFeatureChange(firstFeatureId)
    // that includes this.fetchPictureselfOptions(firstFeatureId)
    // as callback in asynchronous setState()
    this.fetchFeatures(pictureselfId);
  }

  // to do: process also features present multiple times (one id several indices)
  // to do: make version of image composer for this component
  //          create image elements for under and over layers just once
  composeImages = () => {
    const {
      customizationVariantImageUrls,
      featureVariantImageUrls,
    } = this.state;
    const activeFeatureIndex = this.state.allFeatureIds.indexOf(
      this.state.activeFeatureId
    );
    const underLayerImageUrls = customizationVariantImageUrls.slice(
      0,
      activeFeatureIndex
    );
    const overLayerImageUrls = customizationVariantImageUrls.slice(
      activeFeatureIndex + 1
    );

    let layerPromises = [];

    let underLayerCanvasDataURL = "";
    if (underLayerImageUrls.length > 0) {
      var underLayerPromise = imageComposer(underLayerImageUrls).then(
        (composedImage) => {
          underLayerCanvasDataURL = composedImage.url;
        }
      );
      layerPromises.push(underLayerPromise);
    }

    let overLayerCanvasDataURL = "";
    if (overLayerImageUrls.length > 0) {
      var overLayerPromise = imageComposer(overLayerImageUrls).then(
        (composedImage) => {
          overLayerCanvasDataURL = composedImage.url;
        }
      );
      layerPromises.push(overLayerPromise);
    }

    Promise.all(layerPromises).then(() => {
      let imageUrls = [];
      let middleLayerIndex = 0;
      if (underLayerCanvasDataURL !== "") {
        imageUrls.push(underLayerCanvasDataURL);
        middleLayerIndex = 1;
      }
      if (overLayerCanvasDataURL !== "") {
        imageUrls.push("");
        imageUrls.push(overLayerCanvasDataURL);
      }

      for (let i = 0; i < featureVariantImageUrls.length; ++i) {
        imageUrls[middleLayerIndex] = featureVariantImageUrls[i];
        imageComposer(imageUrls)
          .then((composedImage) => {
            this.setState((state) => {
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
                imagesComposed: state.imagesComposed + 1,
              };
            });
          })
          .catch((error) => {
            alert(error);
          });
      }
    });
  };

  fetchPictureselfFeaturesApi = (id) => {
    return axios.get(API_URL + "features/p/" + id, getConfig());
  };

  fetchChannelFeaturesApi = (username) => {
    return axios.get(API_URL + "features/" + username, getConfig());
  };

  fetchFeaturesApiPictureselfChannelSwitch = () => {
    const { type } = this.props;
    if (type == "pictureself") {
      return this.fetchPictureselfFeaturesApi(this.props.id);
    } else {
      return this.fetchChannelFeaturesApi(this.props.id);
    }
  };

  fetchFeatures = (pictureselfId) => {
    this.fetchFeaturesApiPictureselfChannelSwitch()
      .then((response) => {
        this.setState(
          {
            featureIds: response.data["feature_ids"],
            featureTitles: response.data["feature_titles"],
            allFeatureIds: response.data["all_feature_ids"],
          },
          () => {
            this.fetchPictureselfCustomizationVariants(pictureselfId);

            //this.fetchPictureselfFeatureVariants(pictureselfId, featureId);
          }
        );
        //const firstFeatureId = response.data["feature_ids"][0];
        //this.handleActiveFeatureChange(firstFeatureId);
      })
      .catch((error) => {
        const errorMessage = apiErrorHandler(error);
        // to do
        alert(errorMessage);
      });
  };

  fetchPictureselfCustomizationPositionApi = (featureId) => {
    return axios.get(
      API_URL + "customizations/" + featureId + "/",
      getConfig()
    );
  };

  fetchPictureselfCustomizationVariants = (pictureselfId) => {
    this.fetchPictureselfCustomizationVariantsApi(pictureselfId)
      .then((response) => {
        this.setState(
          {
            customizationVariantImageUrls: response.data["variant_image_urls"],
            customizationVariantAlts: response.data["variant_original_names"],
          },
          () => {
            this.handleActiveFeatureChange(this.state.featureIds[0]);
          }
        );
      })
      .catch((error) => {
        const errorMessage = apiErrorHandler(error);
        // to do
        alert(errorMessage);
      });
  };

  fetchPictureselfCustomizationVariantsApi = (id) => {
    return axios.get(
      API_URL + "p/" + id + "/customization-variants/",
      getConfig()
    );
  };

  fetchPictureselfFeatureVariants = (pictureselfId, featureId) => {
    this.fetchPictureselfFeatureVariantsApi(pictureselfId, featureId)
      .then((response) => {
        this.setState(
          {
            featureVariantImageUrls: response.data["variant_image_urls"],
            featureVariantAlts: response.data["variant_original_names"],
            nImagesComposed: 0,
            canvasDataURLs: [],
            widths: [],
            heights: [],
          },
          () => {
            this.composeImages();
          }
        );
      })
      .catch((error) => {
        const errorMessage = apiErrorHandler(error);
        // to do
        alert(errorMessage);
      });
  };

  fetchPictureselfFeatureVariantsApi = (pictureselfId, featureId) => {
    return axios.get(
      API_URL + "p/" + pictureselfId + "/feature-variants/" + featureId + "/",
      getConfig()
    );
  };

  fetchPictureselfCustomizationPosition = (featureId) => {
    this.fetchPictureselfCustomizationPositionApi(featureId)
      .then((response) => {
        this.setState({
          activeOptionIndex: response.data["customization_position"],
        });
      })
      .catch((error) => {
        const errorMessage = apiErrorHandler(error);
        // to do
        alert(errorMessage);
      });
  };

  editCustomizationPositionApi = (feature_id, position) => {
    return axios.post(
      API_URL + "customizations/" + feature_id + "/edit/",
      { position: position },
      getConfig()
    );
  };

  handleActiveFeatureChange = (new_active_feature_id) => {
    const pictureselfId = this.props.id;
    this.setState(
      {
        activeFeatureId: new_active_feature_id,
      },
      () => {
        this.fetchPictureselfFeatureVariants(
          pictureselfId,
          new_active_feature_id
        );
        this.fetchPictureselfCustomizationPosition(new_active_feature_id);
      }
    );
  };

  handleActiveOptionChange = (newActiveOptionIndex) => {
    this.setState({ activeOptionIndex: newActiveOptionIndex });
    this.editCustomizationPositionApi(
      this.state.activeFeatureId,
      newActiveOptionIndex
    )
      .then((response) => {
        const {
          customizationVariantImageUrls,
          featureVariantImageUrls,
          featureIds,
          allFeatureIds,
          activeFeatureId,
        } = this.state;
        let newCustomizationVariantImageUrls = [
          ...customizationVariantImageUrls,
        ];
        newCustomizationVariantImageUrls[
          allFeatureIds.indexOf(activeFeatureId)
        ] = featureVariantImageUrls[newActiveOptionIndex];
        this.setState({
          customizationVariantImageUrls: newCustomizationVariantImageUrls,
        });
      })
      .catch((error) => {
        const errorMessage = apiErrorHandler(error);
        // to do
        alert(errorMessage);
      });
  };

  render() {
    const { isAuthenticated } = this.props;

    const {
      activeOptionIndex,
      widths,
      heights,
      canvasDataURLs,
      featureVariantAlts,
      nImagesComposed,
    } = this.state;
    const COLUMN_WIDTH = 200;
    const GUTTER_WIDTH = 10;
    const GUTTER_HEIGHT = 10;
    const ACTIVE_OPTION_BORDER_WIDTH = 4;

    let box_shadow_heights = [];

    for (let i = 0; i < widths.length; i++) {
      if (widths[i] !== undefined) {
        let height =
          widths[i] > COLUMN_WIDTH
            ? heights[i] * (COLUMN_WIDTH / widths[i])
            : heights[i] + (COLUMN_WIDTH - widths[i]);
        box_shadow_heights[i] = height;
      }
    }

    /*
    // ternary operator with accessing element of array from props which data is fetched doesnt work in map
    let activeOptionCardImageWidths;
    let optionCardImageMargins;
    
    for (i = 0; i < widths_heights.length; i++) {
      const width_height = pictureselfs[i];
      box_shadow_heights[pictureself.id] =
        pictureselfs[i].width_height[1] * (200 / pictureself.width_height[0]);
      image_margins[pictureself.id] =
        this.props.columnWidth > pictureself.width_height[0]
          ? this.props.columnWidth - pictureself.width_height[0]
          : 0;
    }
    */
    const featureMenu = this.state.featureIds.map((feature_id, index) => (
      <Button
        basic
        key={feature_id}
        onClick={() => this.handleActiveFeatureChange(feature_id)}
        content={
          this.state.featureTitles[index] === ""
            ? "*"
            : this.state.featureTitles[index]
        }
        active={this.state.activeFeatureId == feature_id}
        size="large"
        style={{
          filter: "brightness(109%)",
          "margin-right": "7px",
          "margin-bottom": "5px",
        }}
        compact
      />
    ));

    // ? replace border with rectangle independent from image to
    // ? properly process images with width smaller than columnWidth
    let optionCards = [];
    for (let index = 0; index < canvasDataURLs.length; ++index) {
      const canvasDataURL = canvasDataURLs[index];
      if (canvasDataURL !== undefined) {
        optionCards.push(
          <div
            key={index.toString()}
            onClick={() => this.handleActiveOptionChange(index)}
            style={{
              width: COLUMN_WIDTH + "px",
              height: box_shadow_heights[index].toString() + "px",
              "box-shadow":
                "0px " +
                box_shadow_heights[index].toString() +
                "px inset rgba(175,175,175,0.075)",
              border:
                index == activeOptionIndex
                  ? "5px solid DodgerBlue"
                  : index == 0
                  ? activeOptionIndex == -1
                    ? "5px solid Silver"
                    : ""
                  : "",
            }}
          >
            <img
              alt={featureVariantAlts[index]}
              src={canvasDataURL}
              style={{
                "max-width": "100%",
                width:
                  index == activeOptionIndex
                    ? widths[index] >
                      COLUMN_WIDTH - 2 * ACTIVE_OPTION_BORDER_WIDTH
                      ? (
                          COLUMN_WIDTH -
                          2 * ACTIVE_OPTION_BORDER_WIDTH
                        ).toString()
                      : ""
                    : "",
                height: "auto",
                margin:
                  index == activeOptionIndex ||
                  (index == 0 && activeOptionIndex == -1)
                    ? (COLUMN_WIDTH - 2 * ACTIVE_OPTION_BORDER_WIDTH >
                      widths[index]
                        ? (COLUMN_WIDTH -
                            2 * ACTIVE_OPTION_BORDER_WIDTH -
                            widths[index]) /
                          2
                        : "0") + "px"
                    : (COLUMN_WIDTH > widths[index]
                        ? (COLUMN_WIDTH - widths[index]) / 2
                        : "0") + "px",

                "z-index": "-1",
                position: "relative",
              }}
            />
          </div>
        );
      }
    }

    const isLoading = nImagesComposed === featureVariantAlts.length;

    if (isAuthenticated) {
      return (
        <div>
          <Link
            to={
              this.props.type == "pictureself"
                ? `/p/${this.props.id}/`
                : `/${this.props.id}/`
            }
          >
            <Button
              style={{
                backgroundColor: "transparent",
                "margin-left": "10px",
                "margin-top": "5px",
                color: "rgb(26, 141, 255)",
                "font-size": "18px",
              }}
              icon
            >
              <Icon
                style={{
                  "padding-right": "25px",
                  color: "rgb(0, 128, 255)",
                }}
                name="check"
              />
              DONE
            </Button>
          </Link>
          <div id="feature-menu">{featureMenu}</div>
          <br />
          <StackGrid
            monitorImagesLoaded={true}
            columnWidth={COLUMN_WIDTH}
            gutterWidth={GUTTER_WIDTH}
            gutterHeight={GUTTER_HEIGHT}
            duration={0}
          >
            {optionCards}
          </StackGrid>
          <div
            style={{
              "margin-top": "35px",
              visibility: isLoading ? "visible" : "hidden",
            }}
          >
            <Loader />
          </div>
        </div>
      );
    } else return <p>Customization isn't available when logged out.</p>;
  }
}
