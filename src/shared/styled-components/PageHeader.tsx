import * as React from "react";
import "./PageHeader.css"

export const PageHeader: React.SFC = ({children}) => (
  <div className="page-header">
    <h1>{children}</h1>
  </div>
);
