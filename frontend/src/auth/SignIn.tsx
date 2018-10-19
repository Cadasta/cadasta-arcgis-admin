import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, Col } from 'reactstrap';

import { PageHeader } from '../shared/styled-components/PageHeader';
import { startOAuth2Flow } from './oauth2';

interface Props extends RouteComponentProps<any> {}
const SignIn: React.SFC<Props> = ({location}) => {
  const next = location.state && location.state.next;
  return (
    <div>
      <PageHeader>Sign In</PageHeader>
      <div className="text-center">
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <p className="lead">
            {
              next
              ?
              <React.Fragment>
                You must be logged in to access
                <code> {next}</code>
              </React.Fragment>
              :
              <React.Fragment>
                Sign in via Cadasta Portal
              </React.Fragment>
            }
          </p>
          <Button color="primary" onClick={startOAuth2Flow.bind(null, next)}>
            Sign In
          </Button>
        </Col>
      </div>
    </div>
  );
};
export default SignIn;
