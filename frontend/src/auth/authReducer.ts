import { Reducer } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { AuthAction, LOGIN, LOGOUT } from "./authActions";

export interface PopulatedAuthState {
  clientId: string;
  username: string;
  token: string;
  tokenExpires: string;
  portal: string;
  tokenDuration: number;
  refreshTokenTTL: number;
};
export type AuthState = PopulatedAuthState | {};

export const defaultState: AuthState = {};

export function authReducer(state: AuthState=defaultState, action: AuthAction): AuthState {
  switch (action.type) {
    case LOGIN:
      return action.value;
    case LOGOUT:
      return {};
  }
  return state;
}

export default persistReducer(
  { key: "auth", storage },
  authReducer
) as Reducer;
