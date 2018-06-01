import * as React from 'react';
import { Container, Row } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Header from './Header';
import { routeSwitch } from './routes';

class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Container>
          <Header />
          <Row>
            <main role="main" className="col-lg-10 offset-lg-1 px-4 pt-0">
              { routeSwitch }
            </main>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
