import * as React from 'react';
import Helmet from 'react-helmet';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import TokenValidator from '../auth/TokenValidator';
import Footer from './Footer';
import Header from './Header';
import Notifications from './Notifications';
import { router } from './routes';

class App extends React.Component {
  public render() {
    return (
      <Router>
        <React.Fragment>
          <Helmet
            defaultTitle="Welcome"
            titleTemplate="%s | Cadasta"
          />
          <TokenValidator />
          <Notifications />
          <Container>
            <div className="col-lg-8 offset-lg-2 px-4 pt-0 position-static">
              <Header />
              <main role="main" className="pt-0 pb-4">
                {router}
              </main>
              <Footer />
            </div>
          </Container>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
