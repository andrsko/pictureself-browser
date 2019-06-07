import React, { Component } from "react";
import { Card } from "semantic-ui-react";
import Avatar from "../avatar";
import { Link } from "react-router-dom";
import "./styles.css";

class UserCard extends Component {
  render() {
    const { name, username, avatar } = this.props;

    return (
      <div className="user-card">
        <Link to={`/${username}`}>
          <img src={avatar} className="user-card-avatar" alt={username} />
        </Link>
        <Link to={`/${username}`}>
          <p className="user-card-name">{name}</p>
        </Link>
        <Link to={`/${username}`}>
          <p className="user-card-username">@{username}</p>
        </Link>
      </div>
    );
  }
}

export default UserCard;
