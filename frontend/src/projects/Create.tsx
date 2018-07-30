import * as React from 'react';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import { connect, DispatchProp } from 'react-redux';
import { Link, RouteProps } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Col, Form, FormGroup, FormText, Input, Label } from 'reactstrap';

import { StoreState } from '../app/reducers';
import { urls } from '../app/routes';
import { ADMIN_API_PROJECT_URL } from '../config';
import { PageHeader } from '../shared/styled-components/PageHeader';

interface Props extends RouteProps, DispatchProp {
  token: string;
}
interface State {
  projectName: string;
  apiResponse?: object;
  projectGroups: string[];
  err: boolean;
}
class Create extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      err: false,
      projectGroups: ['PM', 'FS', 'DC', 'VW'],
      projectName: '',
    };
    this.createProject = this.createProject.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleGroups = this.handleGroups.bind(this);
  }

  public render() {
    return (
      <React.Fragment>
        <PageHeader>Create Project</PageHeader>
        <Breadcrumb>
          <BreadcrumbItem><Link to={urls.Home}>Home</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to={urls.ListProjects}>Projects</Link></BreadcrumbItem>
          <BreadcrumbItem active={true}>Create new project</BreadcrumbItem>
        </Breadcrumb>
        <Form onSubmit={this.createProject}>
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
              <Button color="primary">Submit</Button>{' '}
            </Col>
          </FormGroup>
        </Form>
        {
          this.state.apiResponse &&
          <code style={ this.state.err ? {border: '2px solid red'} : {} }>
            { JSON.stringify(this.state.apiResponse) }
          </code>
        }
      </React.Fragment>
    );
  }

  private handleName(event: React.FormEvent<HTMLInputElement>) {
    this.setState({
      projectName: event.currentTarget.value
    });
  }

  private handleGroups = (newProjectGroups: string[]) => {
    this.setState({
      projectGroups: newProjectGroups
    });
  }

  private createProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Mv to Redux + Thunks
    const options = {
      body: JSON.stringify({
        groups: this.state.projectGroups,
        name: this.state.projectName
      }),
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST'
    };
    fetch(ADMIN_API_PROJECT_URL, options)
      .then(resp => resp.json())
      .then(apiResponse => this.setState({apiResponse, err: false}))
      .catch(apiResponse => this.setState({apiResponse, err: true}));
  }
}

const mapStateToProps = ({ auth }: StoreState) => ({
  token: auth && auth.token,
});
export default connect<{}, {}, React.HTMLAttributes<HTMLElement>>(
  mapStateToProps,
)(Create);
