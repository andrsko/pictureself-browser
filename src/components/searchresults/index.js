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
import EmojiPanel from "../emojipanel";
import "./styles.css";

export default class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pictureselfs: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchPictureselfsSearch();
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchPictureselfsSearch();
    }
  }

  fetchPictureselfsSearchApi = () => {
    let config = store.getState().auth.isAuthenticated
      ? getConfig()
      : { params: store.getState().customize };
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const query = params.get("q");
    return axios.get(API_URL + "p/search/" + query, config);
  };

  fetchPictureselfsSearch = () => {
    this.fetchPictureselfsSearchApi()
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

  render() {
    const { isLoading } = this.state;
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const xpnd = params.get("xpnd") === "true";
    const parsedScr = parseFloat(params.get("scr"));
    const scr = !isNaN(parsedScr) ? parsedScr : 0;

    const noResultsMessage =
      this.state.pictureselfs.length == 0 ? (
        <p id="search-no-results-message">No results</p>
      ) : null;
    if (isLoading) {
      return (
        <div>
          <EmojiPanel isExpanded={xpnd} scrollTop={scr} />
          <div style={{ "margin-top": "35px" }}>
            <Loader />
          </div>
        </div>
      );
    } else {
      const COLUMN_WIDTH = 200;
      const GUTTER_WIDTH = 40;
      const GUTTER_HEIGHT = 20;
      return (
        <div>
          <EmojiPanel isExpanded={xpnd} scrollTop={scr} />
          {noResultsMessage}
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
