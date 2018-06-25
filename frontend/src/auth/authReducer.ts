import { AuthAction, LOGIN, LOGOUT } from "./authActions";

export interface AuthState {
  clientId: string;
  username: string;
  token: string;
  tokenExpires: string;
  portal: string;
  tokenDuration: number;
  refreshTokenTTL: number;
}

export function authReducer(state: AuthState | null=null, action: AuthAction): AuthState | null {
  switch (action.type) {
    case LOGIN:
      return action.value;
    case LOGOUT:
      return null;
  }
  return state;
}
