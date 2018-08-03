import { Reducer } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { getType } from "typesafe-actions";

import { createProject, fetchProjects, ProjectActions} from "./projectsActions";
import { Project } from "./types";

export interface ProjectsState {
  projects: ReadonlyArray<Project>;
  fetching: boolean;
  fetched: boolean;
  fetchError?: string;
  creating: boolean;
  createError?: string;
}

export const defaultState: ProjectsState = {
  projects: [],
  fetching: false,
  fetched: false,
  creating: false,
}


const errTranslations = {
  'Failed to fetch': "Unable to contact backend"
}
const translateErr = (translations: {[errMsg: string]: string}, errMsg: string): string =>
  translations[errMsg] || errMsg;

export const projectsReducer = (state: ProjectsState=defaultState, action: ProjectActions): ProjectsState => {
  switch (action.type) {
    // Fetch Projects
    case getType(fetchProjects.request):
      return {
        ...state,
        fetching: true,
        fetchError: undefined,
      };
    case getType(fetchProjects.failure):
      return {
        ...state,
        fetching: false,
        fetchError: translateErr(
          errTranslations, action.payload.message),
      };
    case getType(fetchProjects.success):
      return {
        ...state,
        fetched: true,
        fetching: false,
        fetchError: undefined,
        projects: action.payload,
      };

    // Create Project
    case getType(createProject.request):
      return {
        ...state,
        creating: true,
        createError: undefined,
      };
    case getType(createProject.failure):
      return {
        ...state,
        creating: false,
        createError: translateErr(
          errTranslations, action.payload.message),
      };
    case getType(createProject.success):
      return {
        ...state,
        creating: false,
        createError: undefined,
        projects: state.projects.concat(action.payload),
      };
  }
  return state;
}

const whitelist: Array<keyof ProjectsState> = ["projects"];
export default persistReducer(
  { key: "projects", storage, whitelist },
  projectsReducer
) as Reducer;
