import * as React from "react";
import { Link } from "react-router-dom";

import { urls } from "../app/routes";
import { PageHeader } from "../shared/styled-components/PageHeader";

interface Props extends React.HTMLAttributes<HTMLElement> {}
const Home: React.SFC<Props> = ({ className = "" }) => (
  <div>
    <PageHeader>Dashboard</PageHeader>
    <ul>
      <li>
        <Link to={urls.SignIn}>Sign In</Link>
      </li>
      <li>
        <Link to={urls.CreateProject}>Create Project</Link>
      </li>
    </ul>
  </div>
);
export default Home;