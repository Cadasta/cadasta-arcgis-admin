import * as React from 'react';
import { Redirect, RouteComponentProps, RouteProps, Switch } from 'react-router-dom';

import GuardedRoute from '../auth/GuardedRoute';
import { Guard, guards } from '../auth/guards';
import SignIn from '../auth/SignIn';
import Home from '../home/Home';
import CreateProject from '../projects/Create';
import NoMatch from './NoMatch';

export const urls: { [key: string]: string } = {
  CreateProject: '/projects/create',
  Home: '/',
  ListProjects: '/projects/list',
  NoMatch: 'nomatch',
  SignIn: '/auth/sign-in',
};

export interface RouteDeclaration extends RouteProps {
  checks?: Guard[];
}
const routeConfig: RouteDeclaration[] = [
  {
    /* Redirect any URL without trailing slash to endpoint with appended slash */
    component: (props: RouteComponentProps<any>) => (
      <Redirect
        to={{
          pathname: `${props.location.pathname}/`,
          state: props.location.state
        }}
      />
    ),
    exact: true,
    path: '/:url*',
    strict: true
  },
  {
    component: SignIn,
    exact: true,
    path: urls.SignIn,
  },
  {
    component: Home,
    exact: true,
    path: urls.Home,
  },
  {
    checks: [guards.isLoggedIn],
    component: CreateProject,
    exact: true,
    path: urls.CreateProject,
  },
  {
    checks: [guards.isLoggedIn],
    component: ListProjects,
    exact: true,
    path: urls.ListProjects,
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
