import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { startOAuth2Flow } from './utils';
export default class SignIn extends React.Component<RouteComponentProps<any>, {}> {

  public render() {
    const handleSignIn = () => startOAuth2Flow(this.props.location.state.next);
    return (
      <div>
        {/* TODO: Add nicer title */}
        <h2>You must be logged in to access <code>{this.props.location.state.next}</code></h2>
        <button onClick={handleSignIn}>Sign In</button>
      </div>
    )
  }
}
