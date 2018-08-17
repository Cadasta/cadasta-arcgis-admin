import { StoreState } from '../app/reducers';
import { AuthState, PopulatedAuthState } from './authReducer';

export const isLoggedIn = (state: AuthState | StoreState): state is PopulatedAuthState => (
  ('auth' in state) ? ('token' in state.auth) : ('token' in state)
);

export type Guard = (state: StoreState) => boolean;
export const guards: { [name: string]: Guard } = {
  isLoggedIn
};
// TODO: Add guard based on user_role (ie only available for 'org_admin')
