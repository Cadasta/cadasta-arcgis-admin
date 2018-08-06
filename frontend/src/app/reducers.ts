import { combineReducers } from 'redux';
import { compose, createStore } from 'redux';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { AuthAction } from '../auth/authActions';
import { authReducer, AuthState } from '../auth/authReducer';
import { CustomWindow } from '../shared/custom.window';
declare let window: CustomWindow;

// Reducers
export const rootReducer = combineReducers({
  auth: authReducer
});
const persistConfig: PersistConfig = { key: 'root', storage };
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Initial State
export interface StoreState {
  auth: AuthState | null;
}
const initialState: StoreState = {
  auth: null
};

// Enhancers
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers();

// Store
type Actions = AuthAction;
export const store = createStore<StoreState, Actions, any, any>(
  persistedReducer,
  initialState,
  enhancer
);
export const persistor = persistStore(store);
