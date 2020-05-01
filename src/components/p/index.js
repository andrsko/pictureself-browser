import { Button, Popup, Icon, Label } from "semantic-ui-react";
import React, { Component } from "react";
import "./styles.css";
import axios from "axios";
import { getConfig } from "../../utils/config";
import { apiErrorHandler } from "../../utils/errorhandler";
import { Link } from "react-router-dom";
import store from "../../store";
import Linkify from "linkifyjs/react";
import Loader from "../loader";
import { API_URL } from "../../api/constants";
import { imageComposer } from "../../utils/imagecomposer";

export default class P extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.pictureself,
      title: "",
      comment: "",
      date: "",
      username: "", //author's
      name: "", //author's
      avatar: "",
      isCustomizable: false,
      isLiked: false,
      numberOfLikes: 0,
      likePopupIsVisible: true,
      buttonsDivHeight: 0,
      canvasDataURL: "",
      width: 0,
      height: 0,
      isLoading: true,
    };
  }
  fetchPictureselfDisplayApi = (id) => {
    let config = store.getState().auth.isAuthenticated
      ? getConfig()
      : { params: store.getState().customize };
    return axios.get(API_URL + "p/" + id, config);
  };

  componentDidMount() {
    this.fetchPictureselfDisplay();
  }

  fetchPictureselfDisplay = () => {
    const pictureself = this.state.id;
    this.fetchPictureselfDisplayApi(pictureself)
      .then((response) => {
        this.setState(
          {
            title: response.data["title"],
            imageUrls: response.data["image_urls"],
            comment: response.data["description"],
            username: response.data["username"],
            name: response.data["name"],
            isCustomizable: response.data["is_customizable"],
            isLiked: response.data["is_liked"],
            numberOfLikes: response.data["number_of_likes"],
            date: response.data["timestamp"],
            avatar: response.data["avatar"],
          },
          () => {
            imageComposer(this.state.imageUrls)
              .then((composedImage) => {
                this.setState(
                  {
                    width: composedImage.width,
                    height: composedImage.height,
                    canvasDataURL: composedImage.url,
                    isLoading: false,
                  },
                  () => {
                    if (
                      this.props.location.pathname ==
                      "/p/" + this.props.match.params.pictureself + "/like"
                    ) {
                      this.toggleLike();
                    }
                    const buttonsDivHeight = this.buttonsDiv.clientHeight;
                    this.setState({ buttonsDivHeight });
                  }
                );
              })
              .catch((error) => {
                alert(error);
              });
          }
        );
      })
      .catch((error) => {
        const errorMessage = apiErrorHandler(error);
        alert(error);
        // to do
        alert(errorMessage);
      });
  };

  toggleLikeApi = (id) => {
    return axios.get(API_URL + "p/" + id + "/toggle-like/", getConfig());
  };
  toggleLike = () => {
    const isAuthenticated = store.getState().auth.isAuthenticated;
    if (isAuthenticated) {
      this.setState({ likePopupIsVisible: false });
      this.setState({
        numberOfLikes: this.state.isLiked
          ? this.state.numberOfLikes - 1
          : this.state.numberOfLikes + 1,
      });
      this.setState({ isLiked: !this.state.isLiked });
      this.toggleLikeApi(this.state.id);
    } else {
      let location = this.props.location;
      location.pathname = "/p/" + this.props.match.params.pictureself + "/like";
      this.props.history.push({
        pathname: "/login",
        state: { from: location },
      });
    }
  };
  redirectToEdit = () => {
    this.props.history.push({
      pathname: "/p/" + this.props.match.params.pictureself + "/edit/",
    });
  };
  redirectToCustomize = () => {
    this.props.history.push({
      pathname: "/p/" + this.props.match.params.pictureself + "/customize/",
    });
  };

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return (
        <div style={{ "margin-top": "35px" }}>
          <Loader />
        </div>
      );
    } else {
      const { width, height, canvasDataURL } = this.state;
      const MIN_WIDTH = 300;
      const MIN_HEIGHT = 300;
      const MENU_WIDTH = 250; //value used also in css file
      const imgPaddingLeftRight =
        width < MIN_WIDTH ? (MIN_WIDTH - width) / 2 : 0;
      const imgPaddingTopBottom =
        height < MIN_HEIGHT ? (MIN_HEIGHT - height) / 2 : 0;
      const avatarImageSrc = this.state.avatar
        ? this.state.avatar
        : "https://afcm.ca/wp-content/uploads/2018/06/no-photo.png";
      const popupStyle = {
        borderRadius: 3,
        opacity: 0.8,
        "padding-top": "0.25em",
        "padding-bottom": "0.25em",
        "padding-left": "0.5em",
        "padding-right": "0.5em",
      };
      const customizeButton = this.state.isCustomizable ? (
        <div id="p-customize-button" onClick={this.redirectToCustomize}>
          CUSTOMIZE
        </div>
      ) : (
        <div />
      );
      //document.body.style = "background: rgb(235, 235, 235);";
      const menuDivHeight = height < MIN_HEIGHT ? MIN_HEIGHT : height;
      const infoDivHeight = menuDivHeight - this.state.buttonsDivHeight;
      const { date } = this.state;
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      let dateDisplay = "";
      if (date != "") {
        const month =
          date[5] === "0"
            ? months[parseInt(date[6]) - 1]
            : months[parseInt(date.substr(5, 2)) - 1];
        const day = date[8] === "0" ? date[9] : date.substr(8, 2);
        const year = date.substr(0, 4);
        dateDisplay = month + " " + day + ", " + year;
      }
      const viewerUsername = store.getState().auth.username;
      const editButton =
        viewerUsername == this.state.username ? (
          <div id="p-edit-button">
            <Button onClick={this.redirectToEdit} basic>
              Edit
            </Button>
          </div>
        ) : null;
      return (
        <div id="p-container">
          <div id="p-background" />
          <div id="p-outer">
            <div id="p-inner">
              {editButton}
              <img
                alt={this.state.title}
                src={canvasDataURL}
                style={{
                  "padding-left": imgPaddingLeftRight,
                  "padding-right": imgPaddingLeftRight,
                  "padding-top": imgPaddingTopBottom,
                  "padding-bottom": imgPaddingTopBottom,
                  "border-right": "1px solid rgb(235, 235, 235)",
                }}
              />
              <div
                id="p-menu"
                style={{
                  height: menuDivHeight,
                }}
              >
                <div id="p-info" style={{ height: infoDivHeight }}>
                  <p id="p-title">{this.state.title}</p>
                  <Link to={`/${this.state.username}/`}>
                    <div id="p-channel">
                      <img src={avatarImageSrc} alt="Avatar" id="p-avatar" />
                      <p id="p-name">{this.state.name}</p>
                    </div>
                  </Link>
                  <p id="p-date">{dateDisplay}</p>
                  <div id="p-comment">
                    <Linkify tagName="p">{this.state.comment}</Linkify>
                  </div>
                </div>
                <div id="p-buttons">
                  {customizeButton}
                  <div
                    id="p-like-download-buttons"
                    ref={(buttonsDiv) => (this.buttonsDiv = buttonsDiv)}
                  >
                    <Popup
                      position="top center"
                      mouseEnterDelay={750}
                      verticalOffset={3}
                      trigger={
                        <a
                          href={canvasDataURL}
                          download={`${this.state.title}.png`}
                        >
                          <Button
                            style={{
                              padding: "10px",
                              "margin-right": "5px",
                              backgroundColor: "transparent",
                            }}
                            icon
                          >
                            <Icon size="large" name="arrow down" />
                          </Button>
                        </a>
                      }
                      content="Download"
                      size="large"
                      style={popupStyle}
                      inverted
                      basic
                    />

                    <Popup
                      position="top center"
                      mouseEnterDelay={750}
                      verticalOffset={-5}
                      disabled={!this.state.likePopupIsVisible}
                      trigger={
                        <Button
                          as="div"
                          style={{
                            "margin-left": "-10px",
                            backgroundColor: "transparent",
                          }}
                          labelPosition="right"
                          onClick={this.toggleLike}
                        >
                          <Button
                            style={{
                              padding: "10px",
                              backgroundColor: "transparent",
                            }}
                            icon
                          >
                            <Icon
                              size="large"
                              name={
                                this.state.isLiked ? "heart" : "heart outline"
                              }
                              color="red"
                            />
                          </Button>
                          <Label
                            style={{
                              backgroundColor: "transparent",
                              color: this.state.isLiked
                                ? "rgb(215, 55, 55)"
                                : "",
                              padding: "0px",
                            }}
                            as="a"
                          >
                            {this.state.numberOfLikes == 0
                              ? ""
                              : this.state.numberOfLikes}
                          </Label>
                        </Button>
                      }
                      content={this.state.isLiked ? "Unike" : "Like"}
                      size="large"
                      style={popupStyle}
                      inverted
                      basic
                    />
                  </div>
                </div>
              </div>
            </div>
            <div id="p-post-inner-space" />
          </div>
        </div>
      );
    }
  }
}
