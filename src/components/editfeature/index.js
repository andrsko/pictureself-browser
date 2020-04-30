import React, { Component } from "react";
import { Form, TextArea } from "semantic-ui-react";

//draft
export default class EditFeature extends Component {
  constructor(props) {
    super(props);
    const feature_id = this.props.feature_id;

    this.state = {
      title: "123",
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  componentDidMount() {
    const { feature_id } = this.props;
    this.props.fetchFeature(feature_id);
  }

  render() {
    let { title } = this.state;
    return (
      <React.Fragment>
        <Form.Input
          type="text"
          name="title"
          control={TextArea}
          value={title}
          onChange={this.handleChange}
        />
      </React.Fragment>
    );
  }
}
