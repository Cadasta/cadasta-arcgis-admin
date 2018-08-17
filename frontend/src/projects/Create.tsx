import * as React from 'react';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { connect, DispatchProp } from 'react-redux';
import { Link, RouteProps } from 'react-router-dom';
import { Alert, Breadcrumb, BreadcrumbItem, Button, Col, Form, FormGroup, FormText, Input, Label } from 'reactstrap';

import { StoreState } from '../app/reducers';
import { urls } from '../app/routes';
import { isLoggedIn } from '../auth/guards';
import { PageHeader } from '../shared/styled-components/PageHeader';
import { ProjectsState } from './projectsReducer';
import { createProject as createProjectThunk } from './projectsThunks';
import { groupShortNames, projectName } from './types';

interface Props extends RouteProps, DispatchProp {
  token: string;
  createProject: typeof createProjectThunk;
  projects: ProjectsState;
}
interface State {
  projectName: projectName;
  projectGroups: groupShortNames;
}
class Create extends React.Component<Props, State> {

  public readonly state: State = {
    projectGroups: ['PM', 'FS', 'DC', 'VW'],
    projectName: '',
  };

  public render() {
    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { projectName: name, projectGroups: groups } = this.state;
      this.props.createProject({ name, groups });
    };
    const { createError, creating } = this.props.projects;
    return (
      <React.Fragment>
        <PageHeader>Create Project</PageHeader>
        <Breadcrumb>
          <BreadcrumbItem><Link to={urls.Home}>Home</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to={urls.ListProjects}>Projects</Link></BreadcrumbItem>
          <BreadcrumbItem active={true}>Create new project</BreadcrumbItem>
        </Breadcrumb>
        <Form onSubmit={handleForm}>
          {
            createError &&
            <Alert color="danger">
              { createError }
            </Alert>
          }
          <FormGroup row={true}>
            <Label for="projectName" sm={3}>Project name</Label>
            <Col sm={9}>
              <Input id="projectName" required={true} value={this.state.projectName} onChange={this.handleName} />
            </Col>
          </FormGroup>
          <FormGroup row={true}>
            <Label sm={3}>Groups</Label>
            <Col sm={9}>
              <CheckboxGroup className="checkboxgroup" checkboxDepth={2} name="projectGroups"
                             value={this.state.projectGroups} onChange={this.handleGroups}>
                <Label check={true}>
                  <Checkbox value="PM" /> Project Managers
                    <FormText color="muted" className="pb-3">
                      Group responsible for all aspects of the project
                    </FormText>
                </Label>
                <Label check={true}>
                  <Checkbox value="FS"/> Supervisors
                    <FormText color="muted" className="pb-3">
                      Group responsible for managing all field operations
                    </FormText>
                </Label>
                <Label check={true}>
                  <Checkbox value="DC"/> Data Collectors
                    <FormText color="muted" className="pb-3">
                      Group responsible for data collection in the field
                    </FormText>
                </Label>
                <Label check={true}>
                  <Checkbox value="VW"/> Viewers
                    <FormText color="muted" className="pb-3">
                      Group with read-only permissions
                    </FormText>
                </Label>
              </CheckboxGroup>
            </Col>
          </FormGroup>
          <FormGroup row={true}>
            <Col sm={{ size: 9, offset: 3 }}>
              <Button color="primary" disabled={creating}>
                Submit
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </React.Fragment>
    );
  }

  private handleName = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      projectName: event.currentTarget.value
    });
  }

  private handleGroups = (newProjectGroups: string[]) => {
    this.setState({
      projectGroups: newProjectGroups
    });
  }
}

const mapStateToProps = ({ auth, projects }: StoreState) => ({
  projects,
  token: isLoggedIn(auth) ? auth.token : undefined,
});
export default connect(mapStateToProps, {
  createProject: createProjectThunk
})(Create);
