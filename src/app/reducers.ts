import { combineReducers } from 'redux';
import { createStore } from 'redux';

import { AuthAction } from '../auth/authActions';
import { authReducer, AuthState } from '../auth/authReducer';
import { CustomWindow } from '../shared/custom.window';
declare let window: CustomWindow;

export interface StoreState {
  auth: AuthState | null;
}
const initialState: StoreState = {
  auth: null,
};
type Actions = AuthAction;

export const rootReducer = combineReducers({
  auth: authReducer,
});
export const store = createStore<StoreState, Actions, any, any>(
  rootReducer, initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
