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
  logout: () => LogoutAction;
}
/*
NOTE: For whatever reason, making this a stateless component causes the following error:
  Property 'className' does not exist on type 'IntrinsicAttributes & IntrinsicClassAttributes<Component<{}, ComponentState, any>> & Readonly<
See:
  - https://github.com/Microsoft/TypeScript/issues/15463
  - https://github.com/Microsoft/TypeScript/issues/18134
*/
class Header extends React.Component<Props> {
  public render() {
    const { className, logout, isLoggedIn } = this.props;
    return (
      <Navbar light className={`flex-md-nowrap p-0 ${className}`}>
        <NavbarBrand color="light" href="/">
          <img src={logo} className="cadasta-logo" alt="logo" />
        </NavbarBrand>
        <div className="justify-content-end">
          {isLoggedIn && (
            <Button outline color="primary" size="sm" onClick={logout}>
              Logout
            </Button>
          )}
        </div>
      </Navbar>
    );
  }
}

const mapStateToProps = ({ auth }: StoreState) => ({
  isLoggedIn: !!auth
});
const mapDispatchToProps = (dispatch: Dispatch<AuthAction>) => ({
  logout: () => dispatch(logoutAction())
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
