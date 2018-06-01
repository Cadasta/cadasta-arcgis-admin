import { UserSession } from '@esri/arcgis-rest-auth';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { ARCGIS_CLIENT_ID, ARCGIS_PORTAL_URL } from '../config';

export default class SignIn extends React.Component<RouteComponentProps<any>, {}> {
  constructor(props: RouteComponentProps<any>) {
    super(props)
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  public render() {
    console.log(JSON.stringify(this.props.location)); // tslint:disable-line

    return (
      <div>
        {/* TODO: Add nicer title */}
        <h2>You must be logged in to...</h2>
        <button onClick={this.handleSignIn}>Sign In</button>
      </div>
    )
  }

  private handleSignIn() {
    UserSession.beginOAuth2({
      clientId: ARCGIS_CLIENT_ID,
      popup: false,
      portal: ARCGIS_PORTAL_URL,
      // A redirect may send a user to this view if they were not logged in. That redirect
      // should add a 'next' property to the path's state. This is used to dictate where
      // the ArcGIS Portal sends a user upon successfully authenticating. Defaults to root.
      redirectUri: `${window.location.origin}${this.props.location.state.next || ''}`,
    });
  }
}
