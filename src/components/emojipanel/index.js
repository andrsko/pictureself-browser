import { Button } from "semantic-ui-react";
import React, { Component } from "react";
import { emojis } from "../../utils/emojis";
import { withRouter } from "react-router-dom";
import "./styles.css";

class EmojiPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: props.isExpanded,
    };
  }

  componentDidMount() {
    document.getElementById(
      "emoji-panel-text-wrapper"
    ).scrollTop = this.props.scrollTop;
  }

  searchEmoji = (emoji) => {
    const scrollPosition = document.getElementById("emoji-panel-text-wrapper")
      .scrollTop;
    this.props.history.push({
      pathname: "/search",
      search:
        "?q=" +
        emoji +
        "&xpnd=" +
        this.state.isExpanded +
        "&scr=" +
        scrollPosition,
    });
  };

  handleEmojiPanelExpandClick = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render() {
    const { isExpanded } = this.state;

    let emojiLinks = [];
    for (const emojiSetName in emojis) {
      let emojiSetLinks = emojis[emojiSetName].map((emoji) => (
        <p
          role="img"
          style={{
            cursor: "pointer",
            display: "inline-block",
            margin: "0px",
            marginRight: "5px",
          }}
          onClick={() => this.searchEmoji(emoji)}
        >
          {emoji}
        </p>
      ));
      emojiLinks = [...emojiLinks, ...emojiSetLinks];
      emojiLinks.push(<br />);
      emojiLinks.push(<br />);
      emojiLinks.push(<br />);
    }
    emojiLinks.pop();
    emojiLinks.pop();
    emojiLinks.pop();
    const emojiPanel = (
      <div id="emoji-panel-outer">
        <div
          id="emoji-panel"
          className={
            isExpanded ? "emoji-panel-expanded" : "emoji-panel-collapsed"
          }
        >
          <div id="emoji-panel-text-wrapper">{emojiLinks}</div>
        </div>

        <Button
          id={
            isExpanded
              ? "emoji-panel-collapse-button"
              : "emoji-panel-expand-button"
          }
          size="large"
          icon={isExpanded ? "angle double up" : "angle double down"}
          onClick={() => this.handleEmojiPanelExpandClick()}
        />
      </div>
    );

    return <div>{emojiPanel}</div>;
  }
}

export default withRouter(EmojiPanel);
