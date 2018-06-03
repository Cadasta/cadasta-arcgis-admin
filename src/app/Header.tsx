import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Button, Navbar, NavbarBrand } from 'reactstrap';

import { AuthAction, logout } from '../auth/authActions';
import './Header.css';
import logo from './logo.png';
import { StoreState } from './reducers';

interface Props {
  isLoggedIn: boolean;
  logout: () => void;
}

const Header = (props: Props) => (
  <Navbar light className="flex-md-nowrap col-lg-10 offset-lg-1 p-0">
    <NavbarBrand color="light" href="/">
      <img src={logo} className="cadasta-logo" alt="logo" />
    </NavbarBrand>
    <div className="justify-content-end">
      <Button outline color="primary" size="sm">Logout</Button>
    </div>
  </Navbar>
)

const mapStateToProps = ({ auth }: StoreState) => ({
  isLoggedIn: !!auth,
});
const mapDispatchToProps = (dispatch: Dispatch<AuthAction>) => ({
  logout: () => dispatch(logout())
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
