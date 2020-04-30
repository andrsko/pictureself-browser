import React, { Component } from "react";
import { connect } from "react-redux";
import Customize from "../../components/customize";
import { editCustomization } from "../../actions";

class CustomizeContainer extends Component {
  render() {
    const { isAuthenticated, customizations, editCustomization } = this.props;
    const type =
      "pictureself" in this.props.match.params ? "pictureself" : "channel";
    const id =
      type == "pictureself"
        ? this.props.match.params.pictureself
        : this.props.match.params.username;
    return (
      <Customize
        isAuthenticated={isAuthenticated}
        type={type}
        id={id}
        customizations={customizations}
        editCustomization={editCustomization}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  customizations: state.customize.customizations,
});

const mapDispatchToProps = (dispatch) => ({
  editCustomization: (newCustomization) => {
    dispatch(editCustomization(newCustomization));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomizeContainer);
