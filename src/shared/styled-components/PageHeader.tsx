import * as React from "react";
import "./PageHeader.css"
// import styled from "styled-components";

// const PageHeaderDiv = styled.div`
// `

export const PageHeader = ({children}: {children: any}) => (
  <div className="page-header">
    <h1>
      {children}
    </h1>
  </div>
);
