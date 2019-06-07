import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import Avatar from "../avatar";
import { Menu, Dropdown, Image, Icon } from "semantic-ui-react";
import "./styles.css";
import NavLink from "../navlink";
import { Button, Popup } from "semantic-ui-react";

class UserNav extends Component {
  render() {
    const { username, logout, showEditProfile, history, name } = this.props;
    const avatar =
      this.props.avatar == ""
        ? "https://afcm.ca/wp-content/uploads/2018/06/no-photo.png"
        : this.props.avatar;
    const myProfile = () => {
      history.push(`/${username}`);
    };
    const handleNewPictureselfButtonClick = () => {
      history.push("/p/0/edit");
    };
    const handleSubscriptionsButtonClick = () => {
      history.push("/subscriptions");
    };
    const handleLikesButtonClick = () => {
      history.push("/likes");
    };
    const popupStyle = {
      borderRadius: 3,
      opacity: 0.8,
      "padding-top": "0.25em",
      "padding-bottom": "0.25em",
      "padding-left": "0.5em",
      "padding-right": "0.5em"
    };

    return (
      <div className="userMenuOuter">
        <Popup
          position="bottom center"
          mouseEnterDelay={750}
          verticalOffset={3}
          trigger={
            <Button
              style={{
                "background-color": "transparent",
                "font-family": '"Arial", Helvetica, sans-serif',
                "font-weight": "normal",
                "font-size": "28px",
                "margin-left": "0px",
                "margin-right": "5px",
                color: "rgb(55,55,55)",
                padding: "10px"
              }}
              content="+"
              size="large"
              onClick={handleNewPictureselfButtonClick}
            />
          }
          content="New Pictureself"
          size="large"
          style={popupStyle}
          inverted
          basic
        />
        <Dropdown
          id="usermenu-dropdown"
          selection
          compact
          trigger={
            <div
              style={{
                display: "flex",
                "align-items": "center",
                "min-width": "125px"
              }}
            >
              <div>
                <Image id="usermenu-dropdown-avatar" src={avatar} />
              </div>
              <div>
                <p
                  style={{
                    "margin-left": "10px",
                    "margin-right": "0px",
                    color: "rgb(55,55,55)",
                    "font-size": "16px"
                  }}
                >
                  {name || username}
                </p>
              </div>
              <div style={{ display: "block", "text-align": "right" }}>
                <Icon
                  style={{ "margin-left": "5px", color: "rgb(55,55,55)" }}
                  name="caret down"
                />
              </div>
            </div>
          }
          icon="null"
        >
          <Dropdown.Menu style={{ "border-color": "white" }}>
            <Dropdown.Item
              onClick={myProfile}
              style={{ color: "rgb(55,55,55)" }}
              icon="user circle"
              text="My channel"
            />
            <Dropdown.Item
              onClick={handleSubscriptionsButtonClick}
              style={{ color: "rgb(55,55,55)" }}
              icon="th list"
              text="Subscriptions"
            />
            <Dropdown.Item
              onClick={handleLikesButtonClick}
              style={{ color: "rgb(55,55,55)" }}
              icon="like"
              text="Likes"
            />
            <Dropdown.Item
              onClick={showEditProfile}
              style={{ color: "rgb(55,55,55)" }}
              icon="edit"
              text="Edit profile"
            />
            <Dropdown.Item
              onClick={logout}
              style={{ color: "rgb(55,55,55)" }}
              icon="sign out"
              text="Logout"
            />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

export default withRouter(UserNav);
