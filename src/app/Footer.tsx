import * as React from "react";

import "./Footer.css";

interface Props extends React.HTMLAttributes<HTMLElement> {}
export default ({ className = "" }: Props) => (
  <footer className={`footer pt-2 pb-2 ${className}`}>
    <small className="text-black-50">
      Copyright {(new Date()).getFullYear()} Cadasta, All Rights Reserved.
    </small>
  </footer>
);
