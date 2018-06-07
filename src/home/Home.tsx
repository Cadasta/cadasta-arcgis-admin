import * as React from "react";
import { Link } from "react-router-dom";

import { urls } from "../app/routes";

interface Props extends React.HTMLAttributes<HTMLElement> {}
export default ({ className = "" }: Props) => (
  <ul>
    <li>
      <Link to={urls.SignIn}>Sign In</Link>
    </li>
    <li>
      <Link to={urls.CreateProject}>Create Project</Link>
    </li>
  </ul>
);
