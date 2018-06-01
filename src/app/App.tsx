import * as React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { Container, Row } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from '../dashboard/Dashboard';
import CreateProject from '../projects/Create';
import './App.css';
import Header from './Header';

class App extends React.Component {
  public render() {
    const redirect = (props: any) => <Redirect to={{
      pathname: `${props.location.pathname}/`,
      state: props.location.state,
    }} />;
    return (
      <React.Fragment>
        <Header />
        <Container fluid={true}>
          <Row>
            <Router>
              <Switch>
                {/* Redirect user to endpoint with appended slash */}
                <Route exact={true} strict={true} path="/:url*" render={redirect} />
                <Route exact={true} path='/dashboard' component={Dashboard} />
                <Route exact={true} path='/projects/create' component={CreateProject} />
              </Switch>
            </Router>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
