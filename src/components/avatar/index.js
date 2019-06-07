import React from "react";
import { Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./styles.css";

const Avatar = props => {
  let { className, avatar, centered, link } = props;

  avatar = avatar || "https://afcm.ca/wp-content/uploads/2018/06/no-photo.png";
  centered = centered !== null ? centered : true;
  className = className || "avatar";
  const avatarComponent = (
    <Image className={className} src={avatar} centered={centered} />
  );
  if (link) {
    return <Link to={link}>{avatarComponent}</Link>;
  }
  return avatarComponent;
};

export default Avatar;
