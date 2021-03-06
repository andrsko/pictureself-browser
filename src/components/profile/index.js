import React, { Component } from "react";
import Avatar from "../avatar";
import "./styles.css";
import { Button } from "semantic-ui-react";
import Gallery from "../gallery";
import axios from "axios";
import { getConfig } from "../../utils/config";
import { apiErrorHandler } from "../../utils/errorhandler";
import store from "../../store";
import { Link } from "react-router-dom";
import Linkify from "linkifyjs/react";
import Loader from "../loader";
import { API_URL } from "../../api/constants";

class Profile extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      pictureselfs: [],
      isSubscribed: this.props.isSubscribed,
      numberOfSubscribers: this.props.numberOfSubscribers,
      isLoading: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.fetchPictureselfsUser();
    if (
      this.props.location.pathname ==
      "/" + this.props.match.params.username + "/subscribe"
    ) {
      this.props.location.pathname = "/" + this.props.match.params.username;
      this.toggleSubscribe();
    }
  }

  fetchPictureselfsUserApi = (username) => {
    let config = store.getState().auth.isAuthenticated
      ? getConfig()
      : { params: store.getState().customize };
    return axios.get(API_URL + "user/" + username + "/pictureselfs/", config);
  };

  fetchPictureselfsUser = () => {
    this.fetchPictureselfsUserApi(this.props.username)
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            pictureselfs: response.data,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        const errorMessage = apiErrorHandler(error);
        // to do
        alert(errorMessage);
      });
  };

  toggleSubscribeApi = (id) => {
    return axios.get(
      API_URL + "user/" + id + "/toggle-subscription/",
      getConfig()
    );
  };

  toggleSubscribe = () => {
    const isAuthenticated = store.getState().auth.isAuthenticated;
    if (isAuthenticated) {
      this.setState({
        numberOfSubscribers: this.state.isSubscribed
          ? this.state.numberOfSubscribers - 1
          : this.state.numberOfSubscribers + 1,
      });
      this.setState({ isSubscribed: !this.state.isSubscribed });
      this.toggleSubscribeApi(this.props.username);
    } else {
      let location = this.props.location;
      location.pathname = "/" + this.props.match.params.username + "/subscribe";
      this.props.history.push({
        pathname: "/login",
        state: { from: location },
      });
    }
  };

  redirectToCustomize = () => {
    if (this.state.pictureselfs.length > 0)
      this.props.history.push({
        pathname:
          "/p/" + this.state.pictureselfs[0].id.toString() + "/customize/",
      });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return (
        <div style={{ "margin-top": "35px" }}>
          <Loader />
        </div>
      );
    } else {
      const { name, username, about, isCustomizable } = this.props;
      const viewerUsername = store.getState().auth.username;
      const subscribeButton =
        viewerUsername == username ? null : (
          <Button
            basic
            onClick={this.toggleSubscribe}
            content={
              this.state.isSubscribed
                ? "SUBSCRIBED" +
                  (this.state.numberOfSubscribers == 0
                    ? ""
                    : "   " + this.state.numberOfSubscribers)
                : "SUBSCRIBE" +
                  (this.state.numberOfSubscribers == 0
                    ? ""
                    : "   " + this.state.numberOfSubscribers)
            }
            size="small"
            compact
            style={{
              color: "rgb(155,155,155)",
              "margin-bottom": "10px",
              "font-weight": "bold",
            }}
          />
        );
      const avatar =
        this.props.avatar == ""
          ? "https://afcm.ca/wp-content/uploads/2018/06/no-photo.png"
          : this.props.avatar;
      const COLUMN_WIDTH = 200;
      const GUTTER_WIDTH = 40;
      const GUTTER_HEIGHT = 20;
      const customizeButton = isCustomizable ? (
        <Button
          basic
          size="small"
          compact
          style={{
            backgroundColor: "transparent",
            "font-weight": "bold",
            "margin-bottom": "10px",
          }}
          onClick={this.redirectToCustomize}
        >
          CUSTOMIZE
        </Button>
      ) : null;

      return (
        <div>
          <div className="profileContainer">
            <div>
              <Avatar
                className="profileAvatar"
                avatar={avatar}
                centered={false}
              />
            </div>
            <div className="profileInfo" style={{ "white-space": "pre" }}>
              <div className="name">{name}</div>

              {subscribeButton}
              {customizeButton}
              <div className="about">
                <Linkify tagName="p">{about}</Linkify>
              </div>
            </div>
          </div>
          <br />
          <Gallery
            columnWidth={COLUMN_WIDTH}
            gutterWidth={GUTTER_WIDTH}
            gutterHeight={GUTTER_HEIGHT}
            pictureselfs={this.state.pictureselfs}
            channel={true}
            duration={0}
          />
        </div>
      );
    }
  }
}

export default Profile;
