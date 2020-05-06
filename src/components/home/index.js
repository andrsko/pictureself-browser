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
import Gallery from "../gallery";
import { Link } from "react-router-dom";
import Loader from "../loader";
import { API_URL } from "../../api/constants";
import store from "../../store";
import "./styles.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pictureselfs: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchPictureselfsIndex();
  }

  fetchPictureselfsIndexApi = () => {
    let config = store.getState().auth.isAuthenticated
      ? getConfig()
      : { params: store.getState().customize };
    return axios.get(API_URL + "p/index/", config);
  };

  fetchPictureselfsIndex = () => {
    this.fetchPictureselfsIndexApi()
      .then((response) => {
        this.setState(
          {
            pictureselfs: response.data,
          },
          () => {
            this.setState({ isLoading: false });
          }
        );
      })
      .catch((error) => {
        const errorMessage = apiErrorHandler(error);
        //alert(error);
        // to do
        alert(errorMessage);
      });
  };

  shuffle = (a) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  };
  render() {
    const { isLoading, pictureselfs } = this.state;
    if (isLoading) {
      return (
        <div style={{ "margin-top": "35px" }}>
          <Loader />
        </div>
      );
    } else {
      const COLUMN_WIDTH = 200;
      const GUTTER_WIDTH = 40;
      const GUTTER_HEIGHT = 20;
      return (
        <div>
          <p id="home-title">Trending</p>
          <Gallery
            columnWidth={COLUMN_WIDTH}
            gutterWidth={GUTTER_WIDTH}
            gutterHeight={GUTTER_HEIGHT}
            pictureselfs={this.shuffle(pictureselfs)}
          />
        </div>
      );
    }
  }
}
