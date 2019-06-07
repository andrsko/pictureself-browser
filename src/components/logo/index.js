import React from "react";
import logo from "./logo.svg";
import "./styles.css";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="logoContainer">
      <Link to="/">
        <img id="logo" src={logo} alt="logo" title="Pictureself Home" />
      </Link>
    </div>
  );
};

export default Logo;
