import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { createProject as createProjectActions, fetchProjects as fetchProjectsActions } from './projectsActions';

import { StoreState } from '../app/reducers';
import { isLoggedIn } from '../auth/guards';
import { ADMIN_API_PROJECT_URL } from '../config';

import { CreateProjectRequest, Project } from './types';

export const fetchProjects: ActionCreator<ThunkAction<Promise<void>, StoreState, void, any>>  = () =>
  async (dispatch, getState) => {
    const { auth, projects } = getState();
    if (!isLoggedIn(auth) || projects.fetching) { return; }
    dispatch(fetchProjectsActions.request());
    const options: RequestInit = {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    };
    fetch(ADMIN_API_PROJECT_URL, options)
      .then(resp => resp.json())
      .then(({ results }) => results)
      .then((projs: ReadonlyArray<Project>) => dispatch(fetchProjectsActions.success(projs)))
      .catch((err: Error) => dispatch(fetchProjectsActions.failure(err)))
    ;
  }
;

export const createProject = (payload: CreateProjectRequest): ThunkAction<Promise<void>, StoreState, void, any> =>
  async (dispatch, getState) => {
    const { auth, projects } = getState();
    if (!isLoggedIn(auth) || projects.fetching) { return; }
    dispatch(createProjectActions.request(payload));
    const options: RequestInit = {
      body: JSON.stringify(payload),
      headers: {
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      method: 'POST',
    };
    fetch(ADMIN_API_PROJECT_URL, options)
      .then(resp => resp.json())
      .then(({ project }: {project: Project}) => {
        if (!project) { throw new Error('No project returned'); }
        return dispatch(createProjectActions.success(project));
      })
      .catch((err: Error) => dispatch(
        createProjectActions.failure(err)
      ))
    ;
  }
;
