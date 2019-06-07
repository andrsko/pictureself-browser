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
import StackGrid from "react-stack-grid";
import "./styles.css";

export default class Customize extends Component {
  constructor(props) {
    super(props);

    this.handleActiveFeatureChange = this.handleActiveFeatureChange.bind(this);
    this.handleActiveOptionChange = this.handleActiveOptionChange.bind(this);

    this.state = {
      feature_ids: [],
      feature_titles: [],
      activeFeatureId: 0, // id
      encodings: [], // encodings
      activeOptionIndex: -1, // int; -1 = not customized yet: silver border around first option
      ext: "",
      alts: [],
      widths_heights: []
    };
  }

  componentDidMount() {
    // includes this.handleActiveFeatureChange(firstFeatureId)
    // that includes this.fetchPictureselfOptions(firstFeatureId)
    // as callback in asynchronous setState()
    this.fetchFeatures();
  }

  fetchPictureselfFeaturesApi = id => {
    return axios.get("http://127.0.0.1:8000/api/features/p/" + id, getConfig());
  };

  fetchChannelFeaturesApi = username => {
    return axios.get(
      "http://127.0.0.1:8000/api/features/" + username,
      getConfig()
    );
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

  // ? refactor as fetchFeatures(): separate APIs from component method
  fetchPictureselfOptionsApi = feature_id => {
    const { type } = this.props;
    if (type == "pictureself") {
      return axios.get(
        "http://127.0.0.1:8000/api/p/" +
          this.props.id +
          "/options/" +
          feature_id +
          "/",
        getConfig()
      );
    } else {
      return axios.get(
        "http://127.0.0.1:8000/api/p/options/" + feature_id + "/",
        getConfig()
      );
    }
  };

  fetchPictureselfOptions = feature_id => {
    this.fetchPictureselfOptionsApi(feature_id)
      .then(response => {
        this.setState({
          encodings: response.data["encodings"],
          activeOptionIndex: response.data["active_option_index"],
          ext: response.data["ext"],
          alts: response.data["alts"],
          widths_heights: response.data["widths_heights"]
        });
      })
      .catch(error => {
        const errorMessage = apiErrorHandler(error);
        alert(error);
        // to do
        alert(errorMessage);
      });
  };

  postNewPosition = (feature_id, position) => {
    return axios.post(
      "http://127.0.0.1:8000/api/customizations/" + feature_id + "/edit/",
      { position: position },
      getConfig()
    );
  };

  handleActiveFeatureChange = new_active_feature_id => {
    this.setState({ activeFeatureId: new_active_feature_id }, () => {
      this.fetchPictureselfOptions(new_active_feature_id);
    });
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
    const { widths_heights } = this.state;
    const encodings = this.state.encodings;
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
    const optionCardsTest = encodings.map((encoding, index) => (
      <div onClick={() => this.handleActiveOptionChange(index)} style={{}}>
        <img
          src={`data:image/${this.state["ext"]};base64,${encoding}`}
          alt={this.state["alts"][index]}
          style={{}}
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
        </div>
      );
    } else return <p>Customization isn't available when logged out.</p>;
  }
}
