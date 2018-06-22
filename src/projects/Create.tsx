import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteProps } from "react-router-dom";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";

import { StoreState } from "../app/reducers";
import { ADMIN_API_PROJECT_URL } from "../config";
import { PageHeader } from "../shared/styled-components/PageHeader";

interface Props extends RouteProps, DispatchProp {
  token: string;
}
interface State {
  projectName: string;
  apiResponse?: object;
  err: boolean;
}
class Create extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      projectName: '',
      err: false,
    };
    this.createProject = this.createProject.bind(this);
    this.handleName = this.handleName.bind(this);
  }

  public render() {
    return (
      <React.Fragment>
        <PageHeader>Create Project</PageHeader>
        <Form onSubmit={this.createProject}>
          <FormGroup row>
            <Col sm={3}>
              <Label className="col-form-label" for="projectName">Project Name</Label>
            </Col>
            <Col sm={9}>
              <Input id="projectName" required value={this.state.projectName} onChange={this.handleName} />
            </Col>
          </FormGroup>
          <Button color="primary">Submit</Button>
        </Form>
        {
          this.state.apiResponse &&
          <code style={ this.state.err ? {border: "2px solid red"} : {} }>
            { JSON.stringify(this.state.apiResponse) }
          </code>
        }
      </React.Fragment>
    )
  }

  private handleName(event:React.FormEvent<HTMLInputElement>) {
    this.setState({projectName: event.currentTarget.value});
  }

  private createProject(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Mv to Redux + Thunks
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.token}`
      },
      body: JSON.stringify({
        name: this.state.projectName,
      })
    };
    fetch(ADMIN_API_PROJECT_URL, options)
      .then(resp => resp.json())
      .then(apiResponse => this.setState({apiResponse, err: false}))
      .catch(apiResponse => this.setState({apiResponse, err: true}))
  }
}

const mapStateToProps = ({ auth }: StoreState) => ({
  token: auth && auth.token,
});
export default connect<{}, {}, React.HTMLAttributes<HTMLElement>>(
  mapStateToProps,
)(Create);
