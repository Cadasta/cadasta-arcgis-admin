import * as React from "react";
import Helmet from "react-helmet";
import { Container } from "reactstrap";
import { BrowserRouter as Router } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import { router } from "./routes";

class App extends React.Component {
  public render() {
    return (
      <Router>
        <React.Fragment>
          <Helmet
            defaultTitle="Welcome"
            titleTemplate="%s | Cadasta"
          />
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
