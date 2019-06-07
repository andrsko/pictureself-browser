import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUserProfile } from "../../actions";
import StatusMessage from "../../components/statusmessage";
import Profile from "../../components/profile";
import "./styles.css";

class UserProfileContainer extends Component {
  componentDidMount() {
    const { username } = this.props.match.params;
    this.props.fetchUserProfile(username);
  }

  componentWillReceiveProps(newProps) {
    const { username: oldUsername } = this.props.match.params;
    const { username: futureUsername } = newProps.match.params;
    if (oldUsername !== futureUsername) {
      this.props.fetchUserProfile(futureUsername);
    }
  }

  render() {
    const { isLoading, error, profile, location, match, history } = this.props;

    if (error || !profile || isLoading) {
      return (
        <StatusMessage
          error={error || !profile}
          errorClassName="userProfile-error"
          errorMessage={error}
          loading={isLoading}
          loadingMessage={``}
          type="default"
        />
      );
    }

    const {
      name,
      username,
      about,
      avatar,
      date_joined,
      is_subscribed,
      number_of_subscribers,
      is_customizable
    } = profile;

    return (
      <Profile
        username={username}
        name={name}
        avatar={avatar}
        about={about}
        dateJoined={date_joined}
        isSubscribed={is_subscribed}
        numberOfSubscribers={number_of_subscribers}
        isCustomizable={is_customizable}
        location={location}
        match={match}
        history={history}
      />
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.userProfile.isLoading,
  profile: state.userProfile.profile,
  error: state.userProfile.error
});

const mapDispatchToProps = dispatch => ({
  fetchUserProfile: username => {
    dispatch(fetchUserProfile(username));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfileContainer);
