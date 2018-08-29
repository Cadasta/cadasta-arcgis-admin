import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Navbar } from 'reactstrap';
import { Dispatch } from 'redux';

import {
  AuthAction,
  logout as logoutAction,
  LogoutAction
} from '../auth/authActions';
import { isLoggedIn as isLoggedInCheck } from '../auth/guards';
import './Header.css';
import logo from './logo.png';
import { StoreState } from './reducers';

interface StateFromProps {
  isLoggedIn: boolean;
  username?: string;
}
interface DispatchFromProps {
  logout: () => LogoutAction;
}
interface ComponentProps extends React.HTMLAttributes<HTMLElement> {}
type Props = StateFromProps & DispatchFromProps & ComponentProps;

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

const mapStateToProps = ({ auth }: StoreState): StateFromProps => ({
  isLoggedIn: isLoggedInCheck(auth),
  username: isLoggedInCheck(auth) ? auth.username : undefined
});
const mapDispatchToProps = (dispatch: Dispatch<AuthAction>): DispatchFromProps => ({
  logout: () => dispatch(logoutAction())
});
export default connect<StateFromProps, DispatchFromProps, ComponentProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
