import * as React from "react";
import { Container } from "reactstrap";

import "./Footer.css";

const Footer = (props: {}) => (
  <footer className="footer">
    <Container>
      <small className="align-right text-black-50">
        Copyright 2018 Cadasta, All Rights Reserved.
      </small>
    </Container>
  </footer>
);
export default Footer;
