import * as React from "react";
import Helmet from "react-helmet";

const NoMatch = ({location}: {location: any}) => (
  <div className="text-center">
    <Helmet>
      <title>Page Not Found | Cadasta</title>
    </Helmet>
    <h1 className="display-1 mb-0">404</h1>
    <h4>Sorry, but the page you are looking for doesn't exist.</h4>
  </div>
);

export default NoMatch;
