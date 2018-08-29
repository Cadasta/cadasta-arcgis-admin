import { Reducer } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { getType } from 'typesafe-actions';

import { createProject, fetchProjects, ProjectActions } from './projectsActions';
import { Project } from './types';

export interface ProjectsState {
  projects: ReadonlyArray<Project>;
  fetching: boolean;
  fetched: boolean;
  fetchError?: string;
  creating: boolean;
  createError?: string;
}

export const defaultState: ProjectsState = {
  creating: false,
  fetched: false,
  fetching: false,
  projects: [],
};

const errTranslations = {
  'Failed to fetch': 'Unable to contact backend'
};
const translateErr = (translations: {[errMsg: string]: string}, errMsg: string): string =>
  translations[errMsg] || errMsg;

export const projectsReducer = (state: ProjectsState = defaultState, action: ProjectActions): ProjectsState => {
  switch (action.type) {
    // Fetch Projects
    case getType(fetchProjects.request):
      return {
        ...state,
        fetchError: undefined,
        fetching: true,
      };
    case getType(fetchProjects.failure):
      return {
        ...state,
        fetchError: translateErr(errTranslations, action.payload.message),
        fetching: false,
      };
    case getType(fetchProjects.success):
      return {
        ...state,
        fetchError: undefined,
        fetched: true,
        fetching: false,
        projects: action.payload,
      };

    // Create Project
    case getType(createProject.request):
      return {
        ...state,
        createError: undefined,
        creating: true,
      };
    case getType(createProject.failure):
      return {
        ...state,
        createError: translateErr(errTranslations, action.payload.message),
        creating: false,
      };
    case getType(createProject.success):
      return {
        ...state,
        createError: undefined,
        creating: false,
        projects: state.projects.concat(action.payload),
      };

    default:
      return state;
  }
};

const whitelist: Array<keyof ProjectsState> = ['projects'];
export default persistReducer(
  { key: 'projects', storage, whitelist },
  projectsReducer
) as Reducer;
