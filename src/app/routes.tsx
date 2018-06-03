import * as React from "react";
import { Redirect, RouteComponentProps, RouteProps, Switch } from "react-router-dom";

import GuardedRoute from "../auth/GuardedRoute";
import { Guard, guards } from "../auth/guards";
import SignIn from "../auth/SignIn";
import Dashboard from "../dashboard/Dashboard";
import CreateProject from "../projects/Create";

export const urls: { [key: string]: string } = {
  SignIn: "/auth/sign-in",
  Dashboard: "/dashboard",
  CreateProject: "/projects/create"
};

export interface RouteDeclaration extends RouteProps {
  checks?: Guard[];
}
const routeConfig: RouteDeclaration[] = [
  /* TODO: Ensure that random URLs redirect to 404. No auth should be required, naturally. */
  {
    /* Redirect any URL without trailing slash to endpoint with appended slash */
    path: "/:url*",
    component: (props: RouteComponentProps<any>) => (
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
    exact: true
  },
  {
    path: urls.Dashboard,
    component: Dashboard,
    exact: true,
    checks: [guards.isLoggedIn]
  },
  {
    path: urls.CreateProject,
    component: CreateProject,
    exact: true,
    checks: [guards.isLoggedIn]
  }
];

export const routeSwitch = (
  <Switch>
    {routeConfig.map((props: RouteDeclaration) => (
      <GuardedRoute key={props.path} {...props} />
    ))}
  </Switch>
);
