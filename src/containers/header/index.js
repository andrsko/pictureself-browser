import React, { Component } from "react";
import { connect } from "react-redux";
import Navlink from "../../components/navlink";
import UserMenu from "../../components/usermenu";
import "./styles.css";
import { showModal, logout } from "../../actions";
import Logo from "../../components/logo";
import { Input } from "semantic-ui-react";
import { withRouter } from "react-router";

class HeaderContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: ""
    };
  }

  handleSearchInputChange = event => {
    this.setState({ searchQuery: event.target.value });
  };
  handleSearchInputSubmit = () => {
    this.props.history.push("/search?q=" + this.state.searchQuery);
  };
  handleSearchInputKeyPress = e => {
    if (e.charCode == 13) {
      this.props.history.push("/search?q=" + this.state.searchQuery);
    }
  };

  render() {
    const {
      isAuthenticated,
      username,
      name,
      avatar,
      handleLogout,
      isLoading,
      showRegister,
      showLogin,
      showEditProfile
    } = this.props;

    return (
      <div className="headerContainerWrapperSticky">
        <div className="headerContainer">
          <div id="header-logo-search">
            <Logo />
            <Input
              style={{ height: "30px", width: "370px", "margin-right": "15px" }}
              icon={{
                name: "search",
                link: true,
                onClick: this.handleSearchInputSubmit
              }}
              placeholder="Search..."
              value={this.state.searchQuery}
              onChange={this.handleSearchInputChange}
              onKeyPress={this.handleSearchInputKeyPress}
            />
            <Navlink />
          </div>
          <UserMenu
            isAuthenticated={isAuthenticated}
            username={username}
            name={name}
            avatar={avatar}
            logout={handleLogout}
            isLoading={isLoading}
            showRegister={showRegister}
            showLogin={showLogin}
            showEditProfile={showEditProfile}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.username,
  name: state.auth.name,
  avatar: state.auth.avatar,
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading
});

const mapDispatchToProps = dispatch => ({
  handleLogout: () => {
    dispatch(logout());
  },
  showRegister: () => {
    dispatch(showModal("REGISTER", {}));
  },
  showLogin: () => {
    dispatch(showModal("LOGIN", {}));
  },
  showEditProfile: () => {
    dispatch(showModal("EDIT_PROFILE", {}));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HeaderContainer));
