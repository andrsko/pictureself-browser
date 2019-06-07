import store from "../../store";
import { Route, Redirect } from "react-router-dom";
import React from "react";

/*
Resource: https://reacttraining.com/react-router/web/example/auth-workflow
Refactor: change to component, connect to store, implement redirectToReferrer in Login, Register
https://stackoverflow.com/questions/43520498/react-router-private-routes-redirect-not-working
https://stackoverflow.com/questions/43892050/react-router-4-x-privateroute-not-working-after-connecting-to-redux
*/
export default function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        store.getState().auth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}
