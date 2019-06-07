import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "semantic-ui-css/semantic.min.css";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import HeaderContainer from "./containers/header";
import ModalContainer from "./containers/modal";
import LoginRegisterPage from "./containers/loginregisterpage";
import UserProfileContainer from "./containers/userprofile";
import UsersContainer from "./containers/users";
import NotFoundPage from "./components/notfoundpage";
import EditPictureself from "./components/editpictureself";
import Likes from "./components/likes";
import SubscriptionList from "./components/subscriptionlist";
import PrivateRoute from "./components/privateroute";
import P from "./components/p";
import CustomizeContainer from "./containers/customize";
import Home from "./components/home";
import About from "./components/about";
import Blog from "./components/blog";
import Help from "./components/help";
import Privacy from "./components/privacy";
import Terms from "./components/terms";
import SearchResults from "./components/searchresults";
import store, { persistor } from "./store";
import Loader from "./components/loader";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<Loader />} persistor={persistor}>
      <Router>
        <Fragment>
          <header className="header-background" />
          <div className="app-layout">
            <HeaderContainer />
            <Switch>
              <Route path="/browse" component={UsersContainer} />
              <Route path="/about" component={About} />
              <Route path="/blog" component={Blog} />
              <Route path="/help" component={Help} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/terms" component={Terms} />
              <Route path="/login" component={LoginRegisterPage} />
              <PrivateRoute path="/likes" component={Likes} />
              <PrivateRoute
                path="/subscriptions"
                component={SubscriptionList}
              />
              <Route path="/search" component={SearchResults} />
              <Route
                path="/p/:pictureself/customize"
                component={CustomizeContainer}
              />
              <PrivateRoute
                path="/p/:pictureself/edit"
                component={EditPictureself}
              />
              <Route path="/p/:pictureself/like" component={P} />
              <Route path="/p/:pictureself" component={P} />
              <Route exact path="/" component={Home} />
              <Route
                path="/:username/customize"
                component={CustomizeContainer}
              />
              <Route path="/:username" component={UserProfileContainer} />
              <Route component={NotFoundPage} />
            </Switch>
            <br />
          </div>
          <ModalContainer />
        </Fragment>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
