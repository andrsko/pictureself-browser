import React, { Component } from "react";
import { connect } from "react-redux";
import Customize from "../../components/customize";

class CustomizeContainer extends Component {
  render() {
    const { isAuthenticated } = this.props;
    const type =
      "pictureself" in this.props.match.params ? "pictureself" : "channel";
    const id =
      type == "pictureself"
        ? this.props.match.params.pictureself
        : this.props.match.params.username;
    return <Customize isAuthenticated={isAuthenticated} type={type} id={id} />;
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(CustomizeContainer);
