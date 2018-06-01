import * as React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import logo from './logo.png';

export default () => (
  <Navbar light={true} fixed="top" color="light" className="flex-md-nowrap p-0 shadow">
    <NavbarBrand color="light" href="/">
      <img src={logo} className="cadasta-logo" alt="logo" />
    </NavbarBrand>
  </Navbar>
)
