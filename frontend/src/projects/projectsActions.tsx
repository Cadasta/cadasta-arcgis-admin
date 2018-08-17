import { ActionType, createAsyncAction } from 'typesafe-actions';
import { CreateProjectRequest, Project } from './types';

export const fetchProjects = createAsyncAction(
  'FETCH_PROJECTS_REQUEST',
  'FETCH_PROJECTS_SUCCESS',
  'FETCH_PROJECTS_FAILURE'
)<void, ReadonlyArray<Project>, Error>();

export const createProject = createAsyncAction(
  'CREATE_PROJECT_REQUEST',
  'CREATE_PROJECT_SUCCESS',
  'CREATE_PROJECT_FAILURE'
)<CreateProjectRequest, Project, Error>();

export type ProjectActions = ActionType<
  typeof fetchProjects
  |
  typeof createProject
>;
