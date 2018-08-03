import * as React from "react";
import { MdRefresh } from "react-icons/md";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Breadcrumb, BreadcrumbItem, Button, Table } from "reactstrap";

import { StoreState } from "../app/reducers";
import { urls } from "../app/routes";
import { isLoggedIn } from "../auth/guards";
import { PageHeader } from "../shared/styled-components/PageHeader";
import { ProjectsState } from "./projectsReducer";
import { fetchProjects as fetchProjectsThunk } from "./projectsThunks";
import { Project } from "./types";

interface Props extends React.HTMLAttributes<HTMLElement> {
  token: string;
  fetchProjects: typeof fetchProjectsThunk;
  projects: ProjectsState;
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

  public componentDidMount() {
    if (!this.props.projects.fetched) {
      this.props.fetchProjects();
    }
  }

  public render() {
    const { fetchProjects } = this.props;
    const { fetchError, fetching, projects } = this.props.projects;
    return (
      <div>
        <PageHeader>Projects</PageHeader>
        <Breadcrumb>
          <BreadcrumbItem><Link to={urls.Home}>Home</Link></BreadcrumbItem>
          <BreadcrumbItem active>Projects</BreadcrumbItem>
        </Breadcrumb>
        <Button color="primary" size="sm" className="mb-3" tag={Link} to={urls.CreateProject}>
          Create New
        </Button>
        <Button outline color="secondary" size="sm" className="mb-3 float-right" disabled={ fetching } onClick={ fetchProjects }>
          <MdRefresh style={{ verticalAlign: 'middle' }} className={ fetching ? "icon-spin" : "" } />
        </Button>
        {
          fetchError &&
          <Alert color="danger">
            { fetchError }
          </Alert>
        }
        <ProjectsTable projects={projects} />
      </div>
    );
  }
}

const mapStateToProps = ({ auth, projects }: StoreState) => ({
  token: isLoggedIn(auth) ? auth.token : undefined,
  projects,
});
export default connect(mapStateToProps, {
  fetchProjects: fetchProjectsThunk
})(List);
