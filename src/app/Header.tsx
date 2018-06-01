import * as React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import './Header.css';
import logo from './logo.png';

export default () => (
  <Navbar light={true} className="flex-md-nowrap col-lg-10 offset-lg-1 p-0">
    <NavbarBrand color="light" href="/">
      <img src={logo} className="cadasta-logo" alt="logo" />
    </NavbarBrand>
  </Navbar>
)
