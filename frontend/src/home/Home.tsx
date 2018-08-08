import * as React from 'react';
import { Link } from 'react-router-dom';

import { urls } from '../app/routes';
import { PageHeader } from '../shared/styled-components/PageHeader';

interface Props extends React.HTMLAttributes<HTMLElement> {}
const Home: React.SFC<Props> = ({ className = '' }) => (
  <div>
    <PageHeader>Home</PageHeader>
    <ul>
      <li>
        <Link to={urls.CreateProject}>Create Project</Link>
      </li>
      <li>
        <Link to={urls.ListProjects}>View Projects</Link>
      </li>
    </ul>
  </div>
);
export default Home;
