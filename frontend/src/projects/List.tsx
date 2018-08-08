import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Button, Table } from "reactstrap";

import { StoreState } from "../app/reducers";
import { urls } from "../app/routes";
import { ADMIN_API_PROJECT_URL } from "../config";
import { PageHeader } from "../shared/styled-components/PageHeader";
import { Project } from "./types";

interface Props extends React.HTMLAttributes<HTMLElement> {
  token: string;
}
interface State {
  projects: ReadonlyArray<Project>;
}

const ProjectsTable = ({ projects }: {projects: ReadonlyArray<Project>}) => (
  <Table hover>
    <thead>
      <tr>
        <th>Project Name</th>
        <th>Owner</th>
        <th>Created</th>
        <th>Last Updated</th>
      </tr>
    </thead>
    <tbody>
      {
        projects.map((project, i) =>
          <tr key={i}>
            <th scope="row">{ project.name }</th>
            <td>{ project.created_by }</td>
            <td>{ new Date(project.created_date).toDateString() }</td>
            <td>{ new Date(project.modified_date).toDateString() }</td>
          </tr>
        )
      }
    </tbody>
  </Table>

);

class List extends React.Component<Props, State> {

  public readonly state: State = {
    projects: []
  };

  public componentDidMount() {
    this.fetchProjects();
  }

  public render() {
    return (
      <div>
        <PageHeader>Projects</PageHeader>
        <Breadcrumb>
          <BreadcrumbItem><Link to={urls.Home}>Home</Link></BreadcrumbItem>
          <BreadcrumbItem active>Projects</BreadcrumbItem>
        </Breadcrumb>
        <Button color="primary" size="sm" className="mb-3" tag={Link} to={urls.CreateProject}>Create New</Button>
        <ProjectsTable projects={this.state.projects} />
      </div>
    );
  }
  private fetchProjects() {
    // TODO: Mv to Redux + Thunks
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.token}`
      }
    };
    fetch(ADMIN_API_PROJECT_URL, options)
      .then(resp => resp.json())
      .then(({ results }) => results)
      .then((projects: ReadonlyArray<Project>) => this.setState({ projects }))
    ;
  }
}

const mapStateToProps = ({ auth }: StoreState) => ({
  token: auth && auth.token,
});
export default connect<{}, {}, React.HTMLAttributes<HTMLElement>>(
  mapStateToProps,
)(List);
