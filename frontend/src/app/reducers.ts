import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";

import { AuthAction } from "../auth/authActions";
import authReducer, { AuthState, defaultState as defaultAuthState } from "../auth/authReducer";
import projectsReducer, { defaultState as defaultProjectsState, ProjectsState } from "../projects/projectsReducer"
import { CustomWindow } from "../shared/custom.window";
declare let window: CustomWindow;

// Initial State
export interface StoreState {
  auth: AuthState;
  projects: ProjectsState
}
const initialState: StoreState = {
  auth: defaultAuthState,
  projects: defaultProjectsState
};

// Enhancers
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(
  applyMiddleware(thunk)
);

// Store
type Actions = AuthAction;
export const store = createStore<StoreState, Actions, any, any>(
  // Reducers
  combineReducers({
    auth: authReducer,
    projects: projectsReducer,
  }),
  initialState,
  enhancer
);
export const persistor = persistStore(store);
