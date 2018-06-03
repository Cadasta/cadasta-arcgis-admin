import { AuthState } from './authReducer';

// Login
export const LOGIN = "LOGIN";
export type LOGIN = typeof LOGIN;
export interface LoginAction {
  type: LOGIN;
  value: AuthState;
}
export const login = (session: string): LoginAction => ({
  type: LOGIN,
  value: JSON.parse(session)
});

// Logout
export const LOGOUT = "LOGOUT";
export type LOGOUT = typeof LOGOUT;
export interface LogoutAction {
  type: LOGOUT;
}
export const logout = (): LogoutAction => ({
  type: LOGOUT
});

export type AuthAction = LoginAction | LogoutAction;
