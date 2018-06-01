import * as React from 'react';

export default class extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <main role="main" className="col-md-8 offset-md-2 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Create Project</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group mr-2">
                <button className="btn btn-sm btn-outline-secondary">Share</button>
                <button className="btn btn-sm btn-outline-secondary">Export</button>
              </div>
              <button className="btn btn-sm btn-outline-secondary dropdown-toggle">
                {/* <span data-feather="calendar"></span> */}
                This week
                  </button>
            </div>
          </div>

          <h2>Section title</h2>
        </main>
      </React.Fragment>
    )
  }
}
