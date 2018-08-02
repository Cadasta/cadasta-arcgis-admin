import * as React from "react";
import { Redirect, RouteComponentProps, RouteProps, Switch } from "react-router-dom";

import GuardedRoute from "../auth/GuardedRoute";
import { Guard, guards } from "../auth/guards";
import SignIn from "../auth/SignIn";
import Home from "../home/Home";
import CreateProject from "../projects/Create";
import NoMatch from "./NoMatch";

export const urls: { [key: string]: string } = {
  Home: "/",
  SignIn: "/auth/sign-in",
  CreateProject: "/projects/create",
  NoMatch: "nomatch"
};

export interface RouteDeclaration extends RouteProps {
  checks?: Guard[];
}
const routeConfig: RouteDeclaration[] = [
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
    path: urls.Home,
    component: Home,
    exact: true,
  },
  {
    path: urls.CreateProject,
    component: CreateProject,
    exact: true,
    checks: [guards.isLoggedIn]
  },
  {
    component: NoMatch
  }
];

export const router = (
  <Switch>
    {routeConfig.map((props: RouteDeclaration, i: number) => (
      <GuardedRoute key={i} {...props} />
    ))}
  </Switch>
);
