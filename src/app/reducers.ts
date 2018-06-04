import { combineReducers } from "redux";
import { compose, createStore } from "redux";
import persistState from "redux-localstorage";

import { AuthAction } from "../auth/authActions";
import { authReducer, AuthState } from "../auth/authReducer";
import { CustomWindow } from "../shared/custom.window";
declare let window: CustomWindow;

export interface StoreState {
  auth: AuthState | null;
}
const initialState: StoreState = {
  auth: null
};
type Actions = AuthAction;

export const rootReducer = combineReducers({
  auth: authReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(
  persistState() // TODO: Only persist auth slice
);

export const store = createStore<StoreState, Actions, any, any>(
  rootReducer,
  initialState,
  enhancer
);
