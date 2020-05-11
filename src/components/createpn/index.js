import { Button, Form } from "semantic-ui-react";
import React, { Component } from "react";
import axios from "axios";
import store from "../../store";
import { getConfig } from "../../utils/config";
import { apiErrorHandler } from "../../utils/errorhandler";
import { API_URL } from "../../api/constants";

import "./styles.css";

export default class CreatePN extends Component {
  constructor(props) {
    super(props);

    this.state = {
      titles: "",
      files: [],
      urls: [],
      names: [],
      isUploading: false,
    };
  }

  postPictureselfApi = (title, file) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", file);
    formData.append("description", "");
    formData.append("tags", "");
    const config = {
      headers: {
        Authorization: getConfig().headers.Authorization,
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(API_URL + "p/0/edit/", formData, config);
  };

  postPictureselfSequence = (titles, files) => {
    var sequence = Promise.resolve();
    for (let i = 0; i < titles.length; ++i)
      sequence = sequence.then(() =>
        this.postPictureselfApi(titles[i], files[i])
      );
    return sequence;
  };

  postPictureselfs = (titles, files) => {
    const titlesArray = JSON.parse("[" + titles + "]");
    this.setState({ isUploading: true });
    this.postPictureselfSequence(titlesArray, files)
      .then((response) => {
        this.props.history.push("/" + store.getState().auth.username);
      })
      .catch((error) => {
        const errorMessage = apiErrorHandler(error);
        // to do
        alert(errorMessage);
      });
  };

  handleTitlesChange = (event) => {
    this.setState({ titles: event.target.value });
  };

  handleImagesChange = (files) => {
    let nFiles = files.length;
    let newNames = [];
    let newFiles = [];
    let newUrls = [];
    for (let i = 0; i < nFiles; ++i) {
      newFiles.push(files[i]);
      newNames.push(files[i].name);
      newUrls.push(window.URL.createObjectURL(files[i]));
    }
    this.setState({
      files: newFiles,
      names: newNames,
      urls: newUrls,
    });
  };

  render() {
    const { titles, files, urls, names, isUploading } = this.state;
    const images = urls.map((url, index) => (
      <img src={url} alt={names[index]} />
    ));
    return (
      <div>
        <Form style={{ marginTop: "15px", marginLeft: "15px" }}>
          <Form.TextArea
            width="11"
            name="titles"
            placeholder=""
            value={titles}
            onChange={(event) => this.handleTitlesChange(event)}
            maxLength="1000"
          />
        </Form>
        <br />
        <br />
        {images}
        <Button
          as="label"
          style={{
            backgroundColor: "transparent",
            margin: 0,
          }}
          icon="file image"
          htmlFor={"hiddenFileInput"}
        />
        <input
          hidden
          id={"hiddenFileInput"}
          accept="image/*"
          multiple
          type="file"
          onChange={(e) => this.handleImagesChange(e.target.files)}
          onClick={(event) => {
            event.target.value = null;
          }}
        />
        <br />
        <br />
        <Button
          floated="right"
          content="SAVE"
          primary
          size="large"
          style={{
            "margin-right": "35px",
            "margin-bottom": "35px",
          }}
          loading={isUploading}
          onClick={() => this.postPictureselfs(titles, files)}
        />
      </div>
    );
  }
}
