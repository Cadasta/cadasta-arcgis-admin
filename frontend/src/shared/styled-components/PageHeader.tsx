import * as React from 'react';
import { Helmet } from 'react-helmet';
import './PageHeader.css';

export const PageHeader: React.SFC = ({children}) => (
  <div className="page-header">
    <Helmet>
      <title>{children}</title>
    </Helmet>
    <h1>{children}</h1>
  </div>
);
