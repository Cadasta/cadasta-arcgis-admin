import { StoreState } from '../app/reducers';

export type Guard = (state: StoreState) => boolean;
export const guards: { [name: string]: Guard } = {
  isLoggedIn: state => !!state.auth
};
// TODO: Add guard based on user_role (ie only available for 'org_admin')
