import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Button, Col } from "reactstrap";

import { Title } from "../shared/styled-components/Title";
import { startOAuth2Flow } from "./utils";

interface Props extends RouteComponentProps<any> {}
const SignIn = ({location}: Props) => {
  const next = location.state && location.state.next;
  return (
    <div>
      <Title>Sign In</Title>
      <div className="text-center">
        <Col sm="12" md={{ size: 6, offset: 3 }}>
        <p className="lead">
          {next ? (
              <React.Fragment>You must be logged in to access
                <code>&nbsp;{next}</code>
              </React.Fragment>
            ) : (
              <React.Fragment>Sign in via Cadasta Portal
            </React.Fragment>
            )}
            </p>
            <Button color="primary" onClick={startOAuth2Flow.bind(null, next)}>
              Sign In
            </Button>
        </Col>
      </div>
    </div>
  );
}
export default SignIn;
