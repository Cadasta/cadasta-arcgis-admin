import { StoreState } from "../app/reducers";

export type Guard = (state: StoreState) => boolean;
export const guards: { [name: string]: Guard } = {
  isLoggedIn: state => !!state.auth
};
