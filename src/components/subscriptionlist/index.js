import React, { Component } from "react";
import StatusMessage from "../statusmessage";
import UserCard from "../usercard";
import "./styles.css";
import Loader from "../loader";
import { getConfig } from "../../utils/config";
import { apiErrorHandler } from "../../utils/errorhandler";
import axios from "axios";

export default class SubscriptionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channels: [],
      isLoading: true
    };
  }
  componentDidMount() {
    this.fetchChannels();
  }
  fetchChannels = () => {
    this.fetchChannelsApi()
      .then(response => {
        this.setState(
          {
            channels: response.data
          },
          () => {
            this.setState({ isLoading: false });
          }
        );
      })
      .catch(error => {
        const errorMessage = apiErrorHandler(error);
        //alert(error);
        // to do
        //alert(errorMessage);
      });
  };

  fetchChannelsApi = () => {
    return axios.get(
      "http://127.0.0.1:8000/api/user/channels-subscribed-to/",
      getConfig()
    );
  };
  render() {
    const { isLoading, channels } = this.state;
    if (isLoading) {
      return (
        <div style={{ "margin-top": "35px" }}>
          <Loader />
        </div>
      );
    }

    const userCardList = channels.map(user => {
      const { name, username, avatar } = user;

      return (
        <div key={username} className="userCard">
          <UserCard username={username} name={name} avatar={avatar} />
        </div>
      );
    });
    return (
      <div>
        {" "}
        <p id="subscription-list-title">Subscriptions</p>
        <div className="usersContainer"> {userCardList}</div>
      </div>
    );
  }
}
