import {
  Button,
  Checkbox,
  Form,
  Dropdown,
  Message,
  Icon,
  Modal,
  Header,
  Popup
} from "semantic-ui-react";
import React, { Component } from "react";
import "./styles.css";
import axios from "axios";
import { getConfig } from "../../utils/config";
import { apiErrorHandler } from "../../utils/errorhandler";
import { Link } from "react-router-dom";
import { API_URL } from "../../api/constants";
import { number } from "prop-types";

// ?! dont show alt if file is absent
class EditVariant extends Component {
  constructor(props) {
    super(props);
    this.hoverOn = this.hoverOn.bind(this);
    this.hoverOff = this.hoverOff.bind(this);
    this.state = {
      hover: false
    };
  }
  hoverOn = () => {
    this.setState({ hover: true });
  };
  hoverOff = () => {
    this.setState({ hover: false });
  };
  render() {
    let insertVariantButton;
    if (this.props.insert) {
      insertVariantButton = (
        <React.Fragment>
          <Button
            as="label"
            style={{
              backgroundColor: "transparent",
              "margin-left": 0,
              "margin-right": "35px"
            }}
            icon="add"
            size="large"
            htmlFor={
              "hiddenFileInput" +
              "f" +
              this.props.feature_index.toString() +
              "j" +
              this.props.variant_index.toString()
            }
          />
          <input
            hidden
            id={
              "hiddenFileInput" +
              "f" +
              this.props.feature_index.toString() +
              "j" +
              this.props.variant_index.toString()
            }
            type="file"
            onChange={e =>
              this.props.insertVariant(
                this.props.feature_index,
                this.props.variant_index,
                e.target.files
              )
            }
          />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {insertVariantButton}
        <div
          class="variant-container"
          onMouseEnter={this.hoverOn}
          onMouseLeave={this.hoverOff}
        >
          <div>
            <div>
              <Button
                style={{
                  backgroundColor: "transparent",
                  margin: 0,
                  visibility: "hidden"
                }}
                icon="file image"
              />
            </div>
            <div>
              <img
                src={this.props.variant_url}
                alt={this.props.variant_name}
                style={{ margin: 0 }}
                //vspace="10"
              />
            </div>
            <div>
              <Button
                style={{
                  backgroundColor: "transparent",
                  margin: 0,
                  visibility: "hidden"
                }}
                icon="delete"
              />
            </div>
          </div>
          <div>
            <div>
              <Button
                style={{
                  backgroundColor: "transparent",
                  margin: 0,
                  visibility: this.state.hover ? "visible" : "hidden"
                }}
                icon="delete"
                onClick={() =>
                  this.props.removeVariant(
                    this.props.feature_index,
                    this.props.variant_index,
                    this.props.variant_id
                  )
                }
              />
            </div>
            <div>
              <Button
                as="label"
                style={{
                  backgroundColor: "transparent",
                  margin: 0,
                  visibility: this.state.hover ? "visible" : "hidden"
                }}
                icon="file image"
                htmlFor={
                  "hiddenFileInput" +
                  "f" +
                  this.props.feature_index.toString() +
                  "v" +
                  this.props.variant_index.toString()
                }
              />
              <input
                hidden
                id={
                  "hiddenFileInput" +
                  "f" +
                  this.props.feature_index.toString() +
                  "v" +
                  this.props.variant_index.toString()
                }
                type="file"
                onChange={e =>
                  this.props.updateVariant(
                    this.props.variant_id,
                    e.target.files
                  )
                }
              />
            </div>
          </div>
          <div />
        </div>
      </React.Fragment>
    );
  }
}

class EditFeature extends Component {
  constructor(props) {
    super(props);
    this.hoverOn = this.hoverOn.bind(this);
    this.hoverOff = this.hoverOff.bind(this);
    this.importVariantsCheckboxHandleChange = this.importVariantsCheckboxHandleChange.bind(
      this
    );
    this.handleFeatureImportDropdownChange = this.handleFeatureImportDropdownChange.bind(
      this
    );
    this.handleInsertButtonClick = this.handleInsertButtonClick.bind(this);
    this.state = {
      insertChecked: false,
      hover: false,
      feature_to_include: "create_new",
      importedFeatureMessage: false,
      importVariantsIsChecked: false
    };
  }
  showImportFeatureDropdown = () =>
    this.setState(({ importFeature }) => ({ importFeature: !importFeature }));

  hoverOn = () => {
    this.setState({ hover: true });
  };

  hoverOff = () => {
    this.setState({ hover: false });
  };

  handleDismiss = () => {
    this.setState({ importedFeatureMessage: false });
  };

  handleFeatureImportDropdownChange = (e, data) => {
    this.setState({
      feature_to_include: data.value,
      includeFeature: data.value !== "create_new"
    });
  };
  handleInsertButtonClick() {
    this.props.insertFeature(
      this.props.feature_index,
      this.state.feature_to_include,
      this.state.importVariantsIsChecked
    );
    this.setState({
      feature_to_include: "create_new",
      includeFeature: false
    });
  }

  handleChange = (e, { name, value }) => {
    if (this.props.imported) {
      this.setState({ importedFeatureMessage: true });
      setTimeout(() => {
        this.setState({ importedFeatureMessage: false });
      }, 9000);
    } else {
      this.props.updateFeature(this.props.feature_id, value);
    }
  };

  importVariantsCheckboxHandleChange = () =>
    this.setState(({ importVariantsIsChecked }) => ({
      importVariantsIsChecked: !importVariantsIsChecked
    }));
  showInsertPositions = () =>
    this.setState(({ insertChecked }) => ({ insertChecked: !insertChecked }));

  render() {
    let featureToImportOptions = [];
    let option_create_new = {};
    option_create_new["key"] = "create_new";
    option_create_new["text"] = "(create new)";
    option_create_new["value"] = "create_new";
    featureToImportOptions.push(option_create_new);
    for (const [key, value] of Object.entries(this.props.features_to_include)) {
      let option = {};
      option["key"] = key;
      option["text"] = value;
      option["value"] = key;
      featureToImportOptions.push(option);
    }
    let insertFeatureBlock;
    const popupStyle = {
      borderRadius: 3,
      opacity: 0.8,
      "padding-top": "0.25em",
      "padding-bottom": "0.25em",
      "padding-left": "0.5em",
      "padding-right": "0.5em"
    };
    const { feature_to_include } = this.state;
    if (this.props.insert) {
      insertFeatureBlock = (
        <React.Fragment>
          <Button
            basic
            content="Add feature"
            onClick={() => this.handleInsertButtonClick()}
            style={{ "margin-bottom": "20px" }}
          />
          <Dropdown
            onChange={(e, data) =>
              this.handleFeatureImportDropdownChange(e, data)
            }
            options={featureToImportOptions}
            placeholder="Choose feature to import"
            defaultValue="create_new"
            selection
            value={feature_to_include}
            style={{
              visibility:
                Object.keys(this.props.features_to_include).length === 0
                  ? "hidden"
                  : "visible"
            }}
          />
          <Checkbox
            label="Import variants"
            style={{
              "margin-left": "5px",
              visibility:
                this.state.feature_to_include === "create_new"
                  ? "hidden"
                  : "visible"
            }}
            checked={this.state.importVariantsIsChecked}
            onChange={this.importVariantsCheckboxHandleChange}
          />
        </React.Fragment>
      );
    }
    let insertCheckbox;
    //style={{ visibility: this.state.hover ? "visible" : "hidden" }}>
    if (this.props.variant_order.length) {
      insertCheckbox = (
        <div>
          <Checkbox
            slider
            label="Insert variant"
            style={{ "margin-bottom": "0px" }}
            checked={this.state.insertChecked}
            onChange={this.showInsertPositions}
          />
          <br />
          <br />
        </div>
      );
    }
    const variant_order = this.props.variant_order;
    const editVariants = variant_order.map((variant_id, index) => (
      <EditVariant
        key={variant_id}
        variant_index={index}
        feature_index={this.props.feature_index}
        insert={this.state.insertChecked}
        updateVariant={this.props.updateVariant}
        insertVariant={this.props.insertVariant}
        removeVariant={this.props.removeVariant}
        variant_name={this.props.variant_names[variant_id]}
        variant_id={variant_id}
        variant_url={this.props.variant_urls[variant_id]}
        variant_file={this.props.variant_files[variant_id]}
        hover={this.state.hover}
      />
    ));
    let editImportedFeatureErrorMessage;
    if (this.state.importedFeatureMessage) {
      editImportedFeatureErrorMessage = (
        <React.Fragment>
          <Message
            compact
            onDismiss={this.handleDismiss}
            header="The feature is included!"
            content="Title of included feature can only be formatted in the edit menu of pictureself it's originated from."
          />
          <br /> <br />
        </React.Fragment>
      );
    }
    let editVariantsMenu;
    if (!this.props.variantsAreImported) {
      editVariantsMenu = (
        <React.Fragment>
          {" "}
          {insertCheckbox}
          <div id="main">
            {editVariants}{" "}
            <Popup
              position="bottom center"
              mouseEnterDelay={750}
              trigger={
                <div
                  class={
                    this.props.variant_order.length === 0
                      ? "initialAddButtonDiv"
                      : ""
                  }
                >
                  <Button
                    as="label"
                    style={{
                      backgroundColor: "transparent",
                      margin: 0
                    }}
                    icon="add"
                    size="large"
                    htmlFor={
                      "hiddenFileInput" + this.props.feature_index.toString()
                    }
                  />
                  <input
                    hidden
                    id={"hiddenFileInput" + this.props.feature_index.toString()}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e =>
                      this.props.addVariants(
                        this.props.feature_index,
                        e.target.files
                      )
                    }
                    onClick={event => {
                      event.target.value = null;
                    }}
                  />
                </div>
              }
              content="Add variant"
              size="large"
              style={popupStyle}
              inverted
              basic
            />
          </div>
        </React.Fragment>
      );
    } else {
      editVariantsMenu = (
        <Checkbox
          label="Import variants"
          style={{
            "margin-bottom": "20px"
          }}
          checked={true}
          disabled
        />
      );
    }
    return (
      <div>
        <div>
          <br />
          <Form onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff}>
            <Form.Group>
              <Form.Input
                width="11"
                size="large"
                type="text"
                name="title"
                value={this.props.title}
                placeholder="Feature Title"
                onChange={this.handleChange}
              />
              <Form.Button
                class="btn"
                style={{
                  backgroundColor: "transparent",
                  visibility: this.state.hover ? "visible" : "hidden"
                }}
                icon="delete"
                size="huge"
                onClick={() =>
                  this.props.remove_feature(
                    this.props.feature_index,
                    this.props.feature_id
                  )
                }
              />
            </Form.Group>
          </Form>
          {editImportedFeatureErrorMessage}
          {editVariantsMenu}
        </div>
        {insertFeatureBlock}
      </div>
    );
  }
}

// to do: keep track of created variants in form of separate list
//        before assigning id check id on duplicating

export default class EditPictureself extends Component {
  constructor(props) {
    super(props);
    this.updateFeature = this.updateFeature.bind(this);
    this.insertFeature = this.insertFeature.bind(this);
    this.removeFeature = this.removeFeature.bind(this);
    this.addFeature = this.addFeature.bind(this);
    this.updateVariant = this.updateVariant.bind(this);
    this.insertVariant = this.insertVariant.bind(this);
    this.removeVariant = this.removeVariant.bind(this);
    this.handleFeatureImportDropdownChange = this.handleFeatureImportDropdownChange.bind(
      this
    );
    this.addVariants = this.addVariants.bind(this);
    this.state = {
      pictureself_id: this.props.match.params.pictureself, //if create new changes from 0 to created in backend p id
      channel_username: "",
      pictureself_title: "",
      // for header
      initial_pictureself_title: "",
      pictureself_description: "",
      features_to_include: {},
      features: {},
      feature_order: [],
      // "new_features_counter", for id generating
      nfc: 0,
      insertChecked: false,
      feature_to_include: "create_new",
      features_with_imported_variants: [],
      importVariantsIsChecked: false,
      variant_order: [],
      variant_urls: {},
      variant_names: {},
      variant_files: {},
      nvc: 0,
      showDeleteModal: false,
      // 0 variants or error on server side
      // to do: rename "onSave"
      errorOnPost: "",
      // number of variant files sent and processed on server
      // is used to show progress info
      isUploading: false,
      nFilesUploaded: 0,
      legitCreatedVariantIds: [],
      legitCreatedVariantIdsChunk: []
    };
  }

  fetchPictureselfApi = id => {
    return axios.get(API_URL + "p/" + id + "/data/", getConfig());
  };

  fetchFeaturesToIncludeApi = id => {
    return axios.get(
      API_URL + "p/" + id + "/features-to-include/",
      getConfig()
    );
  };

  deletePictureselfApi = id => {
    return axios.delete(API_URL + "p/" + id + "/delete/", getConfig());
  };

  editVariantApi = (id, file) => {
    const formData = new FormData();
    formData.set("file", file);
    const config = {
      headers: {
        Authorization: getConfig().headers.Authorization,
        "content-type": "multipart/form-data"
      }
    };
    return axios.put(
      API_URL + "variants/" + id + "/" + "edit/",
      formData,
      config
    );
  };

  createVariantApi = file => {
    const formData = new FormData();
    formData.set("file", file);
    const config = {
      headers: {
        Authorization: getConfig().headers.Authorization,
        "content-type": "multipart/form-data"
      }
    };
    return axios.post(API_URL + "variants/" + "create/", formData, config);
  };

  editPictureselfInfoApi = (id, info) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(info)) {
      formData.append(key, value);
    }
    const config = {
      headers: {
        Authorization: getConfig().headers.Authorization,
        "content-type": "multipart/form-data"
      }
    };
    if (this.state.pictureself_id === "0") {
      return axios.post(API_URL + "p/" + id + "/edit/", formData, config);
    } else {
      return axios.put(API_URL + "p/" + id + "/edit/", formData, config);
    }
  };

  //---draft----
  /*editPictureselfInfoApi = (id, newInfo) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(newPictureself)) {
      formData.append(key, value);
    }
    const config = {
      headers: {
        Authorization: getConfig().headers.Authorization,
        "content-type": "multipart/form-data"
      }
    };
    if (this.state.pictureself_id === "0") {
      return axios.post(API_URL + "p/" + id + "/edit/", formData, config);
    } else {
      return axios.put(API_URL + "p/" + id + "/edit/", formData, config);
    }
  };*/

  componentDidMount() {
    const { pictureself } = this.props.match.params;
    this.setState({ pictureself_id: pictureself });
    if (pictureself !== "0") {
      this.fetchPictureself();
    }
    this.fetchFeaturesToIncludeApi(pictureself)
      .then(response => {
        this.setState({
          features_to_include: response.data
        });
      })
      .catch(error => {
        const errorMessage = apiErrorHandler(error);
        // to do
        alert(errorMessage);
      });
  }

  fetchPictureself = () => {
    const pictureself = this.state.pictureself_id;
    this.fetchPictureselfApi(pictureself)
      .then(response => {
        const variants = response.data["variants"];
        const variantsLength = variants.length;
        let variant_urls = {};
        let variant_names = {};
        for (let i = 0; i < variantsLength; i++) {
          variant_urls[variants[i].id.toString()] = variants[i].image;
          variant_names[variants[i].id.toString()] = variants[i].original_name;
        }
        const feature_order = JSON.parse(response.data["feature_ids_json"]);
        const variant_order = JSON.parse(response.data["variant_ids_json"]);
        let string_ids_feature_order = [];
        let string_ids_variant_order = [];
        const feature_order_length = feature_order.length;
        const variant_order_length = variant_order.length;
        for (let i = 0; i < feature_order_length; i++) {
          string_ids_feature_order.push(feature_order[i].toString());
        }
        for (let i = 0; i < variant_order_length; i++) {
          string_ids_variant_order.push([]);
          const variant_order_line = variant_order[i];
          const variant_order_line_length = variant_order_line.length;
          for (let j = 0; j < variant_order_line_length; j++) {
            string_ids_variant_order[i].push(variant_order_line[j].toString());
          }
        }
        let string_ids_features = {};
        const features = response.data["features"];
        const features_length = features.length;
        for (let i = 0; i < features_length; i++) {
          string_ids_features[features[i].id.toString()] = features[i].title;
        }
        this.setState({
          pictureself_title: response.data["title"],
          initial_pictureself_title: response.data["title"],
          pictureself_description: response.data["description"],
          channel_username: response.data["username"],
          feature_order: string_ids_feature_order,
          variant_order: string_ids_variant_order,
          features: string_ids_features,
          variant_urls: variant_urls,
          variant_names: variant_names
        });
      })
      .catch(error => {
        const errorMessage = apiErrorHandler(error);
        alert(error);
        // to do
        alert(errorMessage);
      });
  };

  getNewFiles = () => {
    // to do: refactor using separate this.state.created_variant_ids and this.state.edited_variant_ids
    const edited_created_variant_ids = Object.keys(this.state.variant_files);
    let created_variant_ids = [];
    let edited_variant_ids = [];
    for (let i = 0; i < edited_created_variant_ids.length; ++i)
      if (edited_created_variant_ids[i][0] == "v")
        created_variant_ids.push(edited_created_variant_ids[i]);
      else edited_variant_ids.push(edited_created_variant_ids[i]);
    const newFiles = {
      created_variant_ids: created_variant_ids,
      edited_variant_ids: edited_variant_ids,
      variant_files: this.state.variant_files
    };

    return newFiles;
  };

  getNewInfo = () => {
    // replacing all unique keys for repeating included feature with initial included feature id
    let normalized_feature_order = this.state.feature_order.slice();
    const normalized_feature_order_length = normalized_feature_order.length;
    for (let i = 0; i < normalized_feature_order_length; i++) {
      if (normalized_feature_order[i].indexOf("i") > -1) {
        normalized_feature_order[i] = normalized_feature_order[i].substring(
          0,
          normalized_feature_order[i].indexOf("i")
        );
      }
    }
    const newInfo = {
      title: this.state.pictureself_title,
      description: this.state.pictureself_description,
      feature_order: JSON.stringify(normalized_feature_order),
      variant_order: JSON.stringify(this.state.variant_order),
      features: JSON.stringify(this.state.features)
    };
    return newInfo;
  };

  showImportFeatureDropdown = () =>
    this.setState(({ importFeature }) => ({ importFeature: !importFeature }));

  importVariantsCheckboxHandleChange = () =>
    this.setState(({ importVariantsIsChecked }) => ({
      importVariantsIsChecked: !importVariantsIsChecked
    }));

  showInsertPositions = () =>
    this.setState(({ insertChecked }) => ({ insertChecked: !insertChecked }));

  handlePictureselfTitleChange = event => {
    this.setState({ pictureself_title: event.target.value });
  };

  handlePictureselfDescriptionChange = event => {
    this.setState({ pictureself_description: event.target.value });
  };
  updateFeature = (feature_id, newTitle) => {
    let features = { ...this.state.features };
    let title = { ...features[feature_id] };
    title = newTitle;
    features[feature_id] = title;
    this.setState({ features: features });
  };

  insertFeature = (
    feature_position,
    feature_to_include,
    importVariantsIsChecked
  ) => {
    if (feature_to_include === "create_new") {
      let new_features = { ...this.state.features };
      const new_id = "f" + this.state.nfc.toString();
      const new_title = "";
      const new_feature = { new_id: new_title };
      new_features[new_id] = new_title;
      this.setState({ features: { ...new_features, ...new_feature } });
      const new_nfc = this.state.nfc + 1;
      this.setState({ nfc: new_nfc });
      let new_feature_order = this.state.feature_order.slice();
      new_feature_order.splice(feature_position, 0, new_id);
      this.setState({ feature_order: new_feature_order });
      let new_variant_order = this.state.variant_order.slice();
      new_variant_order.splice(feature_position, 0, []);
      this.setState({ variant_order: new_variant_order });
    } else {
      const new_feature_id =
        feature_to_include + "i" + this.state.nfc.toString();
      if (feature_position === this.state.feature_order.length) {
        this.setState({
          feature_order: [...this.state.feature_order, new_feature_id]
        });

        this.setState({ variant_order: [...this.state.variant_order, []] });
      } else {
        let new_feature_order = this.state.feature_order.slice();
        new_feature_order.splice(feature_position, 0, new_feature_id);
        this.setState({ feature_order: new_feature_order });

        let new_variant_order = this.state.variant_order.slice();
        new_variant_order.splice(feature_position, 0, []);

        this.setState({ variant_order: new_variant_order });
      }
      if (importVariantsIsChecked) {
        this.setState({
          features_with_imported_variants: [
            ...this.state.features_with_imported_variants,
            new_feature_id
          ]
        });
      }
      const new_nfc = this.state.nfc + 1;
      this.setState({ nfc: new_nfc });
      this.setState({
        feature_to_include: "create_new",
        includeFeature: false
      });
    }
  };

  removeFeature = (position, id) => {
    let new_features = { ...this.state.features };
    delete new_features[id];
    this.setState({ features: { ...new_features } });
    let new_feature_order = this.state.feature_order.slice();
    new_feature_order.splice(position, 1);
    this.setState({ feature_order: new_feature_order });
    let new_variant_order = this.state.variant_order.slice();
    new_variant_order.splice(position, 1);
    this.setState({ variant_order: new_variant_order });
  };

  addFeature = () => {
    let new_features = { ...this.state.features };
    const new_id = "f" + this.state.nfc.toString();
    const new_title = "";
    const new_feature = { new_id: new_title };
    new_features[new_id] = new_title;
    this.setState({ features: { ...new_features, ...new_feature } });
    const new_nfc = this.state.nfc + 1;
    this.setState({ nfc: new_nfc });
    this.setState({ feature_order: [...this.state.feature_order, new_id] });
    this.setState({ variant_order: [...this.state.variant_order, []] });
  };

  updateVariant = (variant_id, files) => {
    const new_file = files[0];

    let variant_urls = { ...this.state.variant_urls };
    let variant_url = { ...variant_urls[variant_id] };
    variant_url = window.URL.createObjectURL(new_file);
    variant_urls[variant_id] = variant_url;
    this.setState({ variant_urls: variant_urls });

    let variant_names = { ...this.state.variant_names };
    let variant_name = { ...variant_names[variant_id] };
    variant_name = new_file.name;
    variant_names[variant_id] = variant_name;
    this.setState({ variant_names: variant_names });

    let variant_files = { ...this.state.variant_files };
    let variant_file = { ...variant_files[variant_id] };
    variant_file = new_file;
    variant_files[variant_id] = variant_file;
    this.setState({ variant_files: variant_files });
  };

  insertVariant = (feature_position, variant_position, files) => {
    const new_id = "v" + this.state.nvc.toString();
    const new_file = files[0];
    const new_url = window.URL.createObjectURL(new_file);
    const new_name = new_file.name;
    this.setState({
      variant_files: { ...this.state.variant_files, [new_id]: new_file }
    });
    this.setState({
      variant_names: { ...this.state.variant_names, [new_id]: new_name }
    });
    this.setState({
      variant_urls: { ...this.state.variant_urls, [new_id]: new_url }
    });

    const new_nvc = this.state.nvc + 1;
    this.setState({ nvc: new_nvc });
    let new_variant_order = this.state.variant_order.slice();
    new_variant_order[feature_position].splice(variant_position, 0, new_id);
    this.setState({ variant_order: new_variant_order });
  };

  removeVariant = (feature_position, variant_position, variant_id) => {
    let new_variant_files = { ...this.state.variant_files };
    let new_variant_names = { ...this.state.variant_names };
    let new_variant_urls = { ...this.state.variant_urls };
    delete new_variant_files[variant_id];
    delete new_variant_names[variant_id];
    delete new_variant_urls[variant_id];
    this.setState({ variant_files: { ...new_variant_files } });
    this.setState({ variant_names: { ...new_variant_names } });
    this.setState({ variant_urls: { ...new_variant_urls } });
    let new_variant_order = this.state.variant_order.slice();
    new_variant_order[feature_position].splice(variant_position, 1);
    this.setState({ variant_order: new_variant_order });
  };

  addVariants = (feature_position, files) => {
    let number_of_files = files.length;
    let new_variant_ids = [];
    let new_variant_names = {};
    let new_variant_files = {};
    let new_variant_urls = {};
    let temp_var_id = "";
    for (let i = 0; i < number_of_files; ++i) {
      temp_var_id = "v" + (this.state.nvc + i).toString();
      new_variant_ids.push(temp_var_id);
      new_variant_files[temp_var_id] = files[i];
      new_variant_names[temp_var_id] = files[i].name;
      new_variant_urls[temp_var_id] = window.URL.createObjectURL(files[i]);
    }
    //const new_id = "v" + this.state.nvc.toString();
    //const new_file = files[0];
    this.setState({
      variant_files: { ...this.state.variant_files, ...new_variant_files }
    });
    //const new_variant_name = { new_id: new_file.name };
    this.setState({
      variant_names: { ...this.state.variant_names, ...new_variant_names }
    });
    const new_nvc = this.state.nvc + number_of_files;
    this.setState({ nvc: new_nvc });
    let new_variant_order = this.state.variant_order.slice();
    new_variant_order[feature_position] = [
      ...new_variant_order[feature_position],
      ...new_variant_ids
    ];
    this.setState({ variant_order: new_variant_order });
    //const new_variant_url = window.URL.createObjectURL(new_file);
    this.setState({
      variant_urls: { ...this.state.variant_urls, ...new_variant_urls }
    });
  };

  handleFeatureImportDropdownChange(e, data) {
    this.setState({
      feature_to_include: data.value,
      includeFeature: data.value !== "create_new"
    });
  }

  atLeastOneVariant = () => {
    const variant_order = this.state.variant_order;
    if (variant_order.length == 0) {
      return false;
    } else {
      for (let i = 0; i < variant_order.length; i++) {
        if (variant_order[i].length > 0) {
          return true;
        }
      }
    }
  };

  /*
  // draft
  editVariantsDraft = (pictureselfId, editedVariantIds, variantFiles) => {
    const CHUNK_SIZE = 15;
    const numberOfChunks = ~~(editedVariantIds.length / CHUNK_SIZE);
    const remainder = editedVariantIds.length % CHUNK_SIZE;

    // "+ 1" to process remainder
    for (let i = 0; i < numberOfChunks + 1; ++i) {
      // getting chunk of files
      let editedVariantIdsChunk =
        i < numberOfChunks
          ? editedVariantIds.slice(i * numberOfChunks, (i + 1) * numberOfChunks)
          : editedVariantIds.slice(0, remainder);
      let editedVariantFilesChunk = {};
      for (let editedVariantId of editedVariantIdsChunk)
        editedVariantFilesChunk[editedVariantId] =
          variantFiles[editedVariantId];

      // uploading files
      this.editVariantsApi(pictureselfId, editedVariantFilesChunk).then(
        response => {
          this.setState({
            nFilesUploaded:
              this.state.nFilesUploaded +
              (i == numberOfChunks ? remainder : numberOfChunks)
          });
        }
      );
    }
  };
  */

  // to do: consider merging with editVariants
  createVariants = (createdVariantIds, variantFiles) => {
    const CHUNK_SIZE = 5;
    const nChunks = ~~(createdVariantIds.length / CHUNK_SIZE);
    var sequence = Promise.resolve();
    const remainder = createdVariantIds.length % CHUNK_SIZE;
    // "+ 1" to process remainder
    for (let i = 0; i < nChunks + 1; ++i) {
      // getting chunk of files
      const iChunkSize = i < nChunks ? CHUNK_SIZE : remainder;
      let createdVariantIdsChunk = createdVariantIds.slice(
        i * CHUNK_SIZE,
        i * CHUNK_SIZE + iChunkSize
      );
      let createdVariantFilesChunk = {};
      for (let createdVariantId of createdVariantIdsChunk) {
        createdVariantFilesChunk[createdVariantId] =
          variantFiles[createdVariantId];
      }
      // ?!!!!??!!??!?!???! p.then(then).then(then)
      // uploading files
      sequence = sequence.then(() =>
        this.createVariantsChunk(
          createdVariantIdsChunk,
          createdVariantFilesChunk
        )
      );
      sequence = sequence.then(() => {
        this.setState(state => ({
          legitCreatedVariantIds: state.legitCreatedVariantIds.concat(
            state.legitCreatedVariantIdsChunk
          ),
          nFilesUploaded:
            state.nFilesUploaded + (i == nChunks ? remainder : CHUNK_SIZE)
        }));
      });
    }
    return sequence;
  };

  createVariantsChunk = (createdVariantIds, variantFiles) => {
    var sequence = Promise.resolve();
    this.setState({ legitCreatedVariantIdsChunk: [] }, () => {
      for (let i = 0; i < createdVariantIds.length; ++i) {
        sequence = sequence.then(() =>
          this.createVariantApi(variantFiles[createdVariantIds[i]])
        );
        sequence = sequence.then(response => {
          this.setState(state => ({
            legitCreatedVariantIdsChunk: [
              ...state.legitCreatedVariantIdsChunk,
              response.data["new_variant_id"]
            ]
          }));
        });
      }
    });
    return sequence;
  };

  editVariants = (editedVariantIds, variantFiles) => {
    const CHUNK_SIZE = 5;
    const nChunks = ~~(editedVariantIds.length / CHUNK_SIZE);
    const remainder = editedVariantIds.length % CHUNK_SIZE;
    var sequence = Promise.resolve();

    // "+ 1" to process remainder
    for (let i = 0; i < nChunks + 1; ++i) {
      // getting chunk of files
      const iChunkSize = i < nChunks ? CHUNK_SIZE : remainder;
      let editedVariantIdsChunk = editedVariantIds.slice(
        i * CHUNK_SIZE,
        i * CHUNK_SIZE + iChunkSize
      );
      let editedVariantFilesChunk = {};
      for (let editedVariantId of editedVariantIdsChunk)
        editedVariantFilesChunk[editedVariantId] =
          variantFiles[editedVariantId];

      // uploading files
      sequence = sequence.then(() =>
        this.editVariantsChunk(editedVariantIdsChunk, editedVariantFilesChunk)
      );
      sequence = sequence.then(() => {
        this.setState(state => ({
          nFilesUploaded:
            state.nFilesUploaded + (i == nChunks ? remainder : CHUNK_SIZE)
        }));
      });
    }
    return sequence;
  };

  editVariantsChunk = (editedVariantIds, variantFiles) => {
    var sequence = Promise.resolve();
    for (let i = 0; i < editedVariantIds.length; ++i) {
      sequence = sequence.then(() =>
        this.editVariantApi(
          editedVariantIds[i],
          variantFiles[editedVariantIds[i]]
        )
      );
    }
    return sequence;
  };

  /*
  // draft
  createVariantsDraft = (createdVariantIds, variantFiles) => {
    const CHUNK_SIZE = 15;
    const numberOfChunks = ~~(createdVariantIds.length / CHUNK_SIZE);
    const remainder = createdVariantIds.length % CHUNK_SIZE;

    let legitCreatedVariantIds = {};

    // "+ 1" to process remainder
    for (let i = 0; i < numberOfChunks + 1; ++i) {
      // getting chunk of files
      let createdVariantIdsChunk =
        i < numberOfChunks
          ? createdVariantIds.slice(
              i * numberOfChunks,
              (i + 1) * numberOfChunks
            )
          : createdVariantIds.slice(0, remainder);
      let createdVariantFilesChunk = {};
      for (let createdVariantId of createdVariantIdsChunk)
        createdVariantFilesChunk[createdVariantId] =
          variantFiles[createdVariantId];

      // uploading files
      this.createVariantsApi(createdVariantFilesChunk).then(response => {
        Object.assign(
          legitCreatedVariantIds,
          JSON.parse(response.data.legit_created_variant_ids)
        );
        this.setState(state => {
          return {
            nFilesUploaded:
              state.nFilesUploaded +
              (i == numberOfChunks ? remainder : numberOfChunks)
          };
        });
      });
    }
    return legitCreatedVariantIds;
  };
  */

  // to do: rename "save" instead of "post"
  //        state variable also
  showErrorOnPost = message => {
    const RETENTION_TIME = 9000;
    this.setState({ errorOnPost: message });
    setTimeout(() => {
      this.setState({ errorOnPost: "" });
    }, RETENTION_TIME);
  };

  editPictureself = () => {
    if (this.atLeastOneVariant()) {
      this.setState({
        isUploading: true
      });
      let newInfo = this.getNewInfo();
      let newFiles = this.getNewFiles();
      const pictureselfId = this.state.pictureself_id;

      this.editVariants(newFiles.edited_variant_ids, newFiles.variant_files)
        .then(response => {
          this.createVariants(
            newFiles.created_variant_ids,
            newFiles.variant_files
          ).then(response => {
            const legitCreatedVariantIds = this.state.legitCreatedVariantIds;

            newInfo["created_variant_ids"] = JSON.stringify(
              legitCreatedVariantIds
            );
            for (let i = 0; i < legitCreatedVariantIds.length; ++i) {
              newInfo["variant_order"] = newInfo["variant_order"].replace(
                newFiles.created_variant_ids[i].toString(),
                legitCreatedVariantIds[i].toString()
              );
            }
            this.editPictureselfInfoApi(pictureselfId, newInfo).then(
              response => {
                const idRedirectTo =
                  this.state.pictureself_id == "0"
                    ? response.data.new_pictureself_id
                    : this.state.pictureself_id;
                this.props.history.push("/p/" + idRedirectTo);
              }
            );
          });
        })
        .catch(error => {
          this.showPostError("An Error Occured, Please Try Again");
          this.setState({
            nFilesUploaded: 0,
            legitCreatedVariantIds: [],
            isUploading: false
          });
        });
    } else this.showErrorOnPost("At Least 1 Variant Should Be Provided");
  };

  handleDeletePictureself = () => {
    const { pictureself } = this.props.match.params;
    if (pictureself !== "0") {
      this.deletePictureselfApi(pictureself)
        .then(response => {
          this.props.history.push("/" + this.state.channel_username);
        })
        .catch(error => {
          this.setState({ errorOnPost: "An Error Occured, Please Try Again" });
          setTimeout(() => {
            this.setState({ errorOnPost: "" });
          }, 9000);
        });
    } else {
      this.props.history.push("/" + this.state.channel_username);
    }
  };

  deleteModalShow = () => this.setState({ showDeleteModal: true });
  closeDeleteModal = () => this.setState({ showDeleteModal: false });

  render() {
    let feature_order_copy = this.state.feature_order.slice();
    const reversed_feature_order = feature_order_copy.reverse();
    const feature_order_length = this.state.feature_order.length;

    let featureToImportOptions = [];
    let option_create_new = {};
    option_create_new["key"] = "create_new";
    option_create_new["text"] = "(create new)";
    option_create_new["value"] = "create_new";
    featureToImportOptions.push(option_create_new);
    for (const [key, value] of Object.entries(this.state.features_to_include)) {
      // remove if check to enable feaure multiple inclusion
      if (!this.state.feature_order.includes(key)) {
        let option = {};
        option["key"] = key;
        option["text"] = value;
        option["value"] = key;
        featureToImportOptions.push(option);
      }
    }

    const editfeatures = reversed_feature_order.map((feature_id, index) => (
      <EditFeature
        key={feature_id}
        feature_index={feature_order_length - index - 1}
        insert={this.state.insertChecked}
        updateFeature={this.updateFeature}
        insertFeature={this.insertFeature}
        remove_feature={this.removeFeature}
        title={
          feature_id.indexOf("i") > -1
            ? this.state.features_to_include[
                feature_id.substring(0, feature_id.indexOf("i"))
              ]
            : this.state.features[feature_id]
        }
        feature_id={feature_id}
        variant_order={
          this.state.variant_order[feature_order_length - index - 1]
        }
        variant_names={this.state.variant_names}
        variant_urls={this.state.variant_urls}
        variant_files={this.state.variant_files}
        addVariants={this.addVariants}
        updateVariant={this.updateVariant}
        insertVariant={this.insertVariant}
        removeVariant={this.removeVariant}
        imported={feature_id.indexOf("i") > -1}
        features_to_include={this.state.features_to_include}
        variantsAreImported={this.state.features_with_imported_variants.includes(
          feature_id
        )}
      />
    ));
    let insertCheckbox;
    if (this.state.feature_order.length > 0) {
      insertCheckbox = (
        <React.Fragment>
          <Checkbox
            toggle
            size="large"
            label="Insert feature"
            style={{ "margin-bottom": "0px" }}
            checked={this.state.insertChecked}
            onChange={this.showInsertPositions}
          />
          <br />
          <br />
        </React.Fragment>
      );
    }
    const { feature_to_include } = this.state;
    const { pictureself } = this.props.match.params;

    // ? add link to title

    return (
      <div style={{ "margin-left": "35px", "padding-bottom": "20px" }}>
        <p id="editpictureself-header">
          {pictureself == 0 ? "Create New" : "Edit "}
          <b> {pictureself == 0 ? "" : this.state.initial_pictureself_title}</b>
        </p>
        <Link to="/help" target="_blank">
          <Icon
            name="question circle outline"
            style={{ color: "dodgerBlue" }}
          />
          <p id="editpictureself-howitworks-link">How It Works</p>
        </Link>
        <Form style={{ marginTop: "15px" }}>
          <Form.Input
            width="11"
            size="large"
            type="text"
            name="pictureself_title"
            placeholder="Title"
            value={this.state.pictureself_title}
            onChange={event => this.handlePictureselfTitleChange(event)}
          />
          <Form.TextArea
            width="11"
            name="pictureself_description"
            placeholder="Comment"
            value={this.state.pictureself_description}
            onChange={event => this.handlePictureselfDescriptionChange(event)}
          />
        </Form>
        <br />
        <br />
        <Button
          content="Add feature"
          onClick={
            this.state.feature_to_include === "create_new"
              ? this.addFeature
              : () =>
                  this.insertFeature(
                    feature_order_length,
                    feature_to_include,
                    this.state.importVariantsIsChecked
                  )
          }
        />{" "}
        <Dropdown
          onChange={(e, data) =>
            this.handleFeatureImportDropdownChange(
              e,
              data,
              feature_order_length
            )
          }
          options={featureToImportOptions}
          placeholder="Choose feature to import"
          defaultValue="create_new"
          selection
          value={feature_to_include}
          style={{
            visibility:
              Object.keys(this.state.features_to_include).length === 0
                ? "hidden"
                : "visible"
          }}
        />
        <Checkbox
          label="Import variants"
          style={{
            "margin-left": "5px",
            visibility:
              feature_to_include === "create_new" ? "hidden" : "visible"
          }}
          checked={this.state.importVariantsIsChecked}
          onChange={this.importVariantsCheckboxHandleChange}
        />
        <br />
        <br />
        {insertCheckbox}
        <div>{editfeatures}</div>
        <br />
        <br />
        <p
          className={
            "info-on-save" + (this.state.errorOnPost != "" ? " error" : "")
          }
        >
          {this.state.errorOnPost != ""
            ? this.state.errorOnPost
            : this.state.isUploading
            ? "Uploading... " +
              Math.max(
                ~~(
                  (this.state.nFilesUploaded /
                    Object.keys(this.state.variant_files).length) *
                  100
                ) - 1,
                1
              ).toString() +
              "%"
            : ""}
        </p>
        <Button
          floated="left"
          size="large"
          icon
          color="red"
          basic
          onClick={this.deleteModalShow}
        >
          <Icon name="trash alternate outline" />
          DELETE
        </Button>
        <Modal
          open={this.state.showDeleteModal}
          size="small"
          onClose={this.closeDeleteModal}
        >
          <Header icon="trash alternate outline" content="Delete pictureself" />
          <Modal.Content>
            <p>Are you sure you want to delete this pictureself?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeDeleteModal} color="blue" inverted>
              <Icon name="remove" /> Cancel
            </Button>
            <Button
              color="red"
              onClick={() => this.handleDeletePictureself()}
              inverted
            >
              <Icon name="checkmark" /> Delete
            </Button>
          </Modal.Actions>
        </Modal>
        <Button
          floated="right"
          content="SAVE"
          primary
          size="large"
          style={{
            "margin-right": "35px",
            "margin-bottom": "35px"
          }}
          loading={this.state.isUploading}
          onClick={
            pictureself === 0
              ? () => this.createPictureself()
              : () => this.editPictureself()
          }
        />
      </div>
    );
  }
}
