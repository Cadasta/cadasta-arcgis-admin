import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Navbar } from 'reactstrap';
import { isLoggedIn as isLoggedInCheck } from '../auth/guards';

import {
  AuthAction,
  logout as logoutAction,
  LogoutAction
} from '../auth/authActions';
import './Header.css';
import logo from './logo.png';
import { StoreState } from './reducers';

export interface Props extends React.HTMLAttributes<HTMLElement> {
  isLoggedIn: boolean;
  username?: string;
  logout: () => LogoutAction;
}
const Header: React.SFC<Props> = ({ className = '', isLoggedIn, username, logout }) => (
  <Navbar light={true} className={`p-0 ${className}`}>
    <Link to="/">
      <div className="navbar-brand">
        <img src={logo} className="cadasta-logo" alt="logo" />
      </div>
    </Link>
    <div className="justify-content-end">
      {username && <small className="text-monospace"> {username} </small>}
      {isLoggedIn && (
        <Button outline={true} color="secondary" size="sm" onClick={logout}>
          Logout
        </Button>
      )}
    </div>
  </Navbar>
);

const mapStateToProps = ({ auth }: StoreState) => ({
  isLoggedIn: isLoggedInCheck(auth),
  username: isLoggedInCheck(auth) ? auth.username : null
});
const mapDispatchToProps = (dispatch: Dispatch<AuthAction>) => ({
  logout: () => dispatch(logoutAction())
});
export default connect<{}, {}, React.HTMLAttributes<HTMLElement>>(
  mapStateToProps,
  mapDispatchToProps
)(Header);
