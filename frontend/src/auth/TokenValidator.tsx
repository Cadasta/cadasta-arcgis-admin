import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { actions as notifActions } from 'redux-notifications';

import { StoreState } from '../app/reducers';
import { RouteDeclaration } from '../app/routes';
import { secondsToString } from '../utils';
import {
  logout as logoutAction,
  LogoutAction
} from './authActions';
import { AuthAction } from './authActions';
import { isLoggedIn } from './guards';

interface StateFromProps {
  tokenExpiry?: string;
}
interface DispatchFromProps {
  logout: () => LogoutAction;
  sendNotification: (message: {[key: string]: any}) => { type: string; payload: {[key: string]: any}};
  dismissNotification: (id: number) => { type: string; payload: number};
}
type ComponentProps = RouteDeclaration;
type Props = StateFromProps & DispatchFromProps & ComponentProps;
interface State {
  notificationId?: number;
  intervals: number[];
}

class TokenValidator extends React.Component<Props, State> {
  public state: State = {intervals: [] as number[]};

  public componentDidMount() {
    // Schedule notification on application start if we have an token expiry date
    if (this.props.tokenExpiry) {
      this.scheduleLogoutNotifier(this.props.tokenExpiry);
    }
  }

  public componentDidUpdate({tokenExpiry: oldTokenExpiry}: Props) {
    // Schedule notification if token expiry gets set
    if (this.props.tokenExpiry !== oldTokenExpiry) {
      // User Logged In
      if (this.props.tokenExpiry) {
        this.scheduleLogoutNotifier(this.props.tokenExpiry);
      } else {
        // User Logged Out
        this.resetNotifications();
      }
    }
  }

  public render() { return <React.Fragment />; }

  private scheduleLogoutNotifier(tokenExpiry: string) {
    this.resetNotifications();

    const getSecsUntilLogout = () => (Date.parse(tokenExpiry) - new Date().getTime()) / 1000;
    const createUpdatingNotification = () => {
      const id = new Date().getTime();
      const interval = window.setInterval(
        () => this.props.sendNotification({
          id,
          kind: 'warning',
          message: `Your login will expire in ${secondsToString(Math.ceil(getSecsUntilLogout()))}. ` +
          `Please logout and re-login at your earliest convenience. `,
          showClose: false,
        }),
        1000,
      );

      // When login counter gets to 0...
      this.setState({
        intervals: this.state.intervals.concat([
          interval,
          window.setTimeout(
            () => {
              // stop creating new messages
              this.resetNotifications();
              // replace going-to-logout warning notification with just-logged-out error notification
              this.props.sendNotification({
                id,
                kind: 'danger',
                message: `Your login has expired.`
              });
              // log user out
              this.props.logout();
            },
            getSecsUntilLogout() * 1000
          )
        ]),
        notificationId: id,
      });
    };

    const secsUntilLogout = Math.max(getSecsUntilLogout(), 0); // 30 min
    const secsUntilNotify = Math.max(secsUntilLogout - (10 * 60), 0); // 30 min
    console.log(`Login valid for another ${secondsToString(secsUntilNotify) || '0 seconds'}.`);
    this.setState({
      intervals: this.state.intervals.concat([
        window.setTimeout(createUpdatingNotification, secsUntilNotify * 1000)
      ])
    });
  }

  private resetNotifications() {
    if (this.state.notificationId) { this.props.dismissNotification(this.state.notificationId); }
    this.setState({
      intervals: this.state.intervals.map(i => {
        window.clearTimeout(i);
        window.clearInterval(i);
        return 0;
      }).filter(i => i)
    });
  }
}

const mapStateToProps = ({ auth }: StoreState): StateFromProps => ({
  tokenExpiry: isLoggedIn(auth) ? auth.tokenExpires : undefined,
});
const mapDispatchToProps = (dispatch: Dispatch<AuthAction>): DispatchFromProps => ({
  dismissNotification: id => dispatch(notifActions.notifDismiss(id)),
  logout: () => dispatch(logoutAction()),
  sendNotification: message => dispatch(notifActions.notifSend(message)),
});
export default connect<StateFromProps, DispatchFromProps, ComponentProps>(
  mapStateToProps,
  mapDispatchToProps
)(TokenValidator);
