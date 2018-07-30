import * as React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Table } from 'reactstrap';

import { urls } from '../app/routes';
import { PageHeader } from '../shared/styled-components/PageHeader';

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ProjectList: React.SFC<Props> = ({ className = '' }) => (
  <div>
    <PageHeader>Projects</PageHeader>
    <Breadcrumb>
      <BreadcrumbItem><Link to={urls.Home}>Home</Link></BreadcrumbItem>
      <BreadcrumbItem active={true}>Projects</BreadcrumbItem>
    </Breadcrumb>
    <Button color="primary" size="sm" className="mb-3" tag={Link} to={urls.CreateProject}>Create New</Button>
    <Table hover={true}>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Owner</th>
            <th>Created</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">A Longer Example of a Sample Project Name Longer</th>
            <td>ownername</td>
            <td>Jun 11, 2018</td>
            <td>Jun 11, 2018</td>
          </tr>
          <tr>
            <th scope="row">Sample Project Name</th>
            <td>ownername</td>
            <td>Jun 11, 2018</td>
            <td>Jun 11, 2018</td>
          </tr>
          <tr>
            <th scope="row">Sample Project Name</th>
            <td>ownername</td>
            <td>Jun 11, 2018</td>
            <td>Jun 11, 2018</td>
          </tr>
        </tbody>
      </Table>

  </div>
);
export default ProjectList;
