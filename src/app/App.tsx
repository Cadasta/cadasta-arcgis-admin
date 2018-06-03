import * as React from "react";
import { Container } from "reactstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import { routeSwitch } from "./routes";

class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Container>
          <Header />
          <main role="main" className="col-lg-10 offset-lg-1 px-4 pt-0">
            {routeSwitch}
          </main>
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
