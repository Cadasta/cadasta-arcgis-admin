import * as React from "react";
import { RouteComponentProps } from 'react-router';
import { Redirect, Route, Switch } from "react-router-dom";

import SignIn from "../auth/SignIn";
import { getUserSession, isCompletingLogin } from "../auth/utils";
import Dashboard from "../dashboard/Dashboard";
import CreateProject from "../projects/Create";

interface RouteDeclaration {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  strict?: boolean;
  loginRequired?: boolean;
}

const urls: {[key: string]: string} = {
  SignIn: "/auth/sign-in",
  Dashboard: "/dashboard",
  CreateProject: "/projects/create",
}

const routeConfig: RouteDeclaration[] = [
  /* TODO: Ensure that random URLs redirect to 404. No auth should be required, naturally. */
  {
    /* Redirect any URL without trailing slash to endpoint with appended slash */
    path: "/:url*",
    component: (props: any) => (
      <Redirect
        to={{
          pathname: `${props.location.pathname}/`,
          state: props.location.state
        }}
      />
    ),
    exact: true,
    strict: true
  },
  {
    path: urls.SignIn,
    component: SignIn,
    exact: true,
  },
  {
    path: urls.Dashboard,
    component: Dashboard,
    exact: true,
    loginRequired: true,
  },
  {
    path: urls.CreateProject,
    component: CreateProject,
    exact: true,
    loginRequired: true,
  }
];

// Component that redirects to login flow if user is not logged in
const LoginRequiredRoute = ({component: Component, ...routeProps}: {component: any, [prop: string]: any}) => {
  const render = (props: RouteComponentProps<any>) => {
    if (isCompletingLogin()) {
      return <Redirect to={{
        pathname: props.location.pathname,
      }} />;
    }
    const isLoggedIn = getUserSession();
    if (isLoggedIn) {
      return <Component {...props} />;
    }
    return <Redirect to={{
        pathname: urls.SignIn,
        state: { ...props.location.state, next: location.pathname },
      }} />;
  }
  return <Route {...routeProps} render={render} />
}

const routes = routeConfig
  .map(
    ({loginRequired=false, ...props}: RouteDeclaration) => {
      const Component = loginRequired ? LoginRequiredRoute : Route;
      return (
        <Component
          key={props.path}
          {...props}
        />
      )
    }
  );

export const routeSwitch = (
  <Switch>
    { routes }
  </Switch>
);
