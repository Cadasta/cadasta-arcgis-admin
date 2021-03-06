import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { Dispatch } from 'redux';

import { StoreState } from '../app/reducers';
import { RouteDeclaration, urls } from '../app/routes';
import { AuthAction, login, LoginAction } from './authActions';
import { Guard } from './guards';
import { completeOAuth2Flow, isCompletingLogin } from './oauth2';

interface StateFromProps {
  state: StoreState;
}
interface DispatchFromProps {
  loginUser: (session: string) => LoginAction;
}
type ComponentProps = RouteDeclaration;
type Props = StateFromProps & DispatchFromProps & ComponentProps;

const GuardedRoute: React.SFC<Props> = ({
  component,
  checks = [],
  state,
  loginUser,
  ...rest
}) => {
  // Analyze URL for OAuth2 credentials. If so, log user in and redirect to same view. Redirecting
  // ensures that the `state` object is updated with the now-logged-in details.
  if (isCompletingLogin()) {
    loginUser(completeOAuth2Flow());
    const renderRedirect = (props: any) => <Redirect to={{ pathname: rest.path || '/' }} />;
    return <Route {...rest} render={renderRedirect} />;
  }

  // Run through checks, ensuring user is allowed to continue to view (defaults to `true`)
  const permitted = checks.reduce(
    (prevPermitted: boolean, check: Guard) => prevPermitted && check(state),
    true
  );

  // Not sure why this is necessary, but TS doesn't seem to like the type of the RouteProps.component:
  // JSX element type 'Component' does not have any construct or call signatures.
  const Component = component as typeof React.Component;

  const render = (props: any) =>
    permitted ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: urls.SignIn,
          state: { next: props.location.pathname }
        }}
      />
    );
  return <Route {...rest} render={render} />;
};

const mapStateToProps = (state: StoreState): StateFromProps => ({ state });
const mapDispatchToProps = (dispatch: Dispatch<AuthAction>): DispatchFromProps => ({
  loginUser: (session: string) => dispatch(login(session))
});
export default connect<StateFromProps, DispatchFromProps, ComponentProps>(
  mapStateToProps,
  mapDispatchToProps
)(GuardedRoute);
