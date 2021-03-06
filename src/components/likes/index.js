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
import Gallery from "../gallery";
import { Link } from "react-router-dom";
import Loader from "../loader";
import "./styles.css";
import { API_URL } from "../../api/constants";

// ? merge with 'home' component into 'set' component
export default class Likes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pictureselfs: [],
      isLoading: true
    };
  }

  componentDidMount() {
    this.fetchPictureselfsIndex();
  }

  fetchPictureselfsIndexApi = () => {
    return axios.get(API_URL + "user/liked-pictureselfs/", getConfig());
  };

  fetchPictureselfsIndex = () => {
    this.fetchPictureselfsIndexApi()
      .then(response => {
        this.setState(
          {
            pictureselfs: response.data
          },
          () => {
            this.setState({ isLoading: false });
          }
        );
      })
      .catch(error => {
        const errorMessage = apiErrorHandler(error);
        //alert(error);
        // to do
        //alert(errorMessage);
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
      const COLUMN_WIDTH = 200;
      const GUTTER_WIDTH = 10;
      const GUTTER_HEIGHT = 20;
      return (
        <div>
          <p id="likes-title">Likes</p>
          <Gallery
            columnWidth={COLUMN_WIDTH}
            gutterWidth={GUTTER_WIDTH}
            gutterHeight={GUTTER_HEIGHT}
            pictureselfs={this.state.pictureselfs}
          />
        </div>
      );
    }
  }
}
