import * as React from "react";

import "./Footer.css";

interface Props extends React.HTMLAttributes<HTMLElement> {}
const Footer = ({ className = "" }: Props) => (
  <footer className={`footer pt-2 pb-2 ${className}`}>
    <small className="text-black-50">
      Copyright 2018 Cadasta, All Rights Reserved.
    </small>
  </footer>
);
export default Footer;
