import * as React from "react";
import { RouteProps } from "react-router-dom";
import { PageHeader } from "../shared/styled-components/PageHeader";

const NoMatch: React.SFC<RouteProps> = ({location}) => (
  <div>
    <PageHeader>Page Not Found</PageHeader>
    <div className="text-center">
      <h2 className="display-1">404</h2>
      <h4>Sorry, but the page you are looking for doesn't exist.</h4>
    </div>
  </div>
);

export default NoMatch;
