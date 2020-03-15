import {
  Button,
  Checkbox,
  Form,
  Dropdown,
  Message,
  Icon,
  Modal,
  Header
} from "semantic-ui-react";
import React, { Component } from "react";
import axios from "axios";
import { getConfig } from "../../utils/config";
import { apiErrorHandler } from "../../utils/errorhandler";
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
      feature_ids: [],
      feature_titles: [],
      activeFeatureId: 0,
      nOptions: 0, //pictureself options specific to active feature
      encodings: [],
      alts: [],
      widths_heights: [],
      encodingsChunk: [],
      altsChunk: [],
      widths_heightsChunk: [],
      activeOptionIndex: -1, // int; -1 = not customized yet: silver border around first option
      ext: "",
      isLoading: true
    };
  }

  componentDidMount() {
    // includes this.handleActiveFeatureChange(firstFeatureId)
    // that includes this.fetchPictureselfOptions(firstFeatureId)
    // as callback in asynchronous setState()
    this.fetchFeatures();
  }

  fetchPictureselfFeaturesApi = id => {
    return axios.get(API_URL + "features/p/" + id, getConfig());
  };

  fetchChannelFeaturesApi = username => {
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

  fetchFeatures = () => {
    this.fetchFeaturesApiPictureselfChannelSwitch()
      .then(response => {
        this.setState({
          feature_ids: response.data["feature_ids"],
          feature_titles: response.data["feature_titles"]
        });
        const firstFeatureId = response.data["feature_ids"][0];
        this.handleActiveFeatureChange(firstFeatureId);
      })
      .catch(error => {
        const errorMessage = apiErrorHandler(error);
        alert(error);
        // to do
        alert(errorMessage);
      });
  };

  fetchPictureselfOptionsInfoApi = (pictureselfId, featureId) => {
    return axios.get(
      API_URL + "p/" + pictureselfId + "/options-info/" + featureId + "/",
      getConfig()
    );
  };

  /*fetchPictureselfOptionEncodingsChunkApi = (
    pictureselfId,
    featureId,
    startPosition,
    nOptions
  ) => {
    return axios.get(
      API_URL +
        "p/" +
        pictureselfId +
        "/options-chunk/" +
        featureId +
        "/" +
        startPosition +
        "/" +
        nOptions +
        "/",
      getConfig()
    );
  };*/
  fetchPictureselfOptionEncodingApi = (
    pictureselfId,
    featureId,
    variantIndex
  ) => {
    return axios.get(
      API_URL +
        "p/" +
        pictureselfId +
        "/option/" +
        featureId +
        "/" +
        variantIndex +
        "/",
      getConfig()
    );
  };

  fetchPictureselfOptionEncodings = (pictureselfId, featureId) => {
    const CHUNK_SIZE = 10;
    const nChunks = ~~(this.state.nOptions / CHUNK_SIZE);
    const remainder = this.state.nOptions % CHUNK_SIZE;
    var sequence = Promise.resolve();
    // "+ 1" to process remainder
    for (let i = 0; i < nChunks + 1; ++i) {
      const iChunkSize = i < nChunks ? CHUNK_SIZE : remainder;
      sequence = sequence.then(() =>
        this.fetchPictureselfOptionEncodingsChunk(
          pictureselfId,
          featureId,
          i * CHUNK_SIZE,
          iChunkSize
        ).then(() => {
          this.setState(state => ({
            encodings: state.encodings.concat(state.encodingsChunk),
            alts: state.alts.concat(state.altsChunk),
            widths_heights: state.widths_heights.concat(
              state.widths_heightsChunk
            ),
            isLoading: i != nChunks
          }));
        })
      );
    }
    return sequence;
  };

  fetchPictureselfOptionEncodingsChunk = (
    pictureselfId,
    featureId,
    startPosition,
    nOptions
  ) => {
    var sequence = Promise.resolve();
    this.setState(
      { encodingsChunk: [], altsChunk: [], widths_heightsChunk: [] },
      () => {
        for (let i = 0; i < nOptions; ++i) {
          sequence = sequence.then(() =>
            this.fetchPictureselfOptionEncodingApi(
              pictureselfId,
              featureId,
              startPosition + i
            ).then(response => {
              this.setState(state => ({
                encodingsChunk: [
                  ...state.encodingsChunk,
                  response.data["encoding"]
                ],
                altsChunk: [...state.altsChunk, response.data["alt"]],
                widths_heightsChunk: [
                  ...state.widths_heightsChunk,
                  response.data["width_height"]
                ]
              }));
            })
          );
        }
      }
    );

    return sequence;
  };

  fetchPictureselfOptions = featureId => {
    // can be pictureself or channel
    const { type } = this.props;
    const pictureselfId = type == "pictureself" ? this.props.id : "0";

    this.fetchPictureselfOptionsInfoApi(pictureselfId, featureId)
      .then(response => {
        this.setState(
          {
            nOptions: response.data["number_of_options"],
            activeOptionIndex: response.data["active_option_index"],
            ext: response.data["ext"]
          },
          () => {
            this.fetchPictureselfOptionEncodings(pictureselfId, featureId);
          }
        );
      })
      .catch(error => {
        const errorMessage = apiErrorHandler(error);
        //alert(error);
        // to do
        alert(errorMessage);
      });
  };

  postNewPosition = (feature_id, position) => {
    return axios.post(
      API_URL + "customizations/" + feature_id + "/edit/",
      { position: position },
      getConfig()
    );
  };

  handleActiveFeatureChange = new_active_feature_id => {
    this.setState(
      {
        activeFeatureId: new_active_feature_id,
        encodings: [],
        alts: [],
        widths_heights: [],
        isLoading: true
      },
      () => {
        this.fetchPictureselfOptions(new_active_feature_id);
      }
    );
  };

  handleActiveOptionChange = new_active_option_index => {
    this.setState({ activeOptionIndex: new_active_option_index });
    this.postNewPosition(this.state.activeFeatureId, new_active_option_index);
  };

  render() {
    const { isAuthenticated } = this.props;
    const COLUMN_WIDTH = 200;
    const GUTTER_WIDTH = 10;
    const GUTTER_HEIGHT = 10;
    const ACTIVE_OPTION_BORDER_WIDTH = 4;
    let box_shadow_heights = [];
    const { encodings, widths_heights, isLoading } = this.state;
    let i;
    for (i = 0; i < widths_heights.length; i++) {
      let height =
        widths_heights[i][0] > COLUMN_WIDTH
          ? widths_heights[i][1] * (COLUMN_WIDTH / widths_heights[i][0])
          : widths_heights[i][1] + (COLUMN_WIDTH - widths_heights[i][0]);
      box_shadow_heights.push(height);
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
    const featureMenu = this.state.feature_ids.map((feature_id, index) => (
      <Button
        basic
        key={feature_id}
        onClick={() => this.handleActiveFeatureChange(feature_id)}
        content={this.state.feature_titles[index]}
        active={this.state.activeFeatureId == feature_id}
        size="large"
        style={{
          filter: "brightness(109%)",
          "margin-right": "7px",
          "margin-bottom": "5px"
        }}
        compact
      />
    ));
    const { activeOptionIndex } = this.state;

    // ? replace border with rectangle independent from image to
    // ? properly process images with width smaller than columnWidth
    const optionCards = encodings.map((encoding, index) => (
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
              : ""
        }}
      >
        <img
          src={`data:image/${this.state["ext"]};base64,${encoding}`}
          alt={this.state["alts"][index]}
          style={{
            "max-width": "100%",
            width:
              index == activeOptionIndex
                ? widths_heights[index][0] >
                  COLUMN_WIDTH - 2 * ACTIVE_OPTION_BORDER_WIDTH
                  ? (COLUMN_WIDTH - 2 * ACTIVE_OPTION_BORDER_WIDTH).toString()
                  : ""
                : "",
            height: "auto",
            margin:
              index == activeOptionIndex ||
              (index == 0 && activeOptionIndex == -1)
                ? (COLUMN_WIDTH - 2 * ACTIVE_OPTION_BORDER_WIDTH >
                  widths_heights[index][0]
                    ? (COLUMN_WIDTH -
                        2 * ACTIVE_OPTION_BORDER_WIDTH -
                        widths_heights[index][0]) /
                      2
                    : "0") + "px"
                : (COLUMN_WIDTH > widths_heights[index][0]
                    ? (COLUMN_WIDTH - widths_heights[index][0]) / 2
                    : "0") + "px",

            "z-index": "-1",
            position: "relative"
          }}
        />
      </div>
    ));

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
                "font-size": "18px"
              }}
              icon
            >
              <Icon
                style={{
                  "padding-right": "25px",
                  color: "rgb(0, 128, 255)"
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
              visibility: isLoading ? "visible" : "hidden"
            }}
          >
            <Loader />
          </div>
        </div>
      );
    } else return <p>Customization isn't available when logged out.</p>;
  }
}
