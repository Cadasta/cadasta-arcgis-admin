import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { Button, Navbar, NavbarBrand } from "reactstrap";

import {
  AuthAction,
  logout as logoutAction,
  LogoutAction
} from "../auth/authActions";
import "./Header.css";
import logo from "./logo.png";
import { StoreState } from "./reducers";

export interface Props extends React.HTMLAttributes<HTMLElement> {
  isLoggedIn: boolean;
  username: string;
  logout: () => LogoutAction;
}
const Header = ({ className = "", isLoggedIn, username, logout }: Props) => (
  <Navbar light className={`p-0 ${className}`}>
    <NavbarBrand color="light" href="/">
      <img src={logo} className="cadasta-logo" alt="logo" />
    </NavbarBrand>
    <div className="justify-content-end">
      {username && <small className="text-monospace"> {username} </small>}
      {isLoggedIn && (
        <Button outline color="secondary" size="sm" onClick={logout}>
          Logout
        </Button>
      )}
    </div>
  </Navbar>
);

const mapStateToProps = ({ auth }: StoreState) => ({
  isLoggedIn: !!auth,
  username: auth && auth.username
});
const mapDispatchToProps = (dispatch: Dispatch<AuthAction>) => ({
  logout: () => dispatch(logoutAction())
});
export default connect<{}, {}, React.HTMLAttributes<HTMLElement>>(
  mapStateToProps,
  mapDispatchToProps
)(Header);
