import { IAuthenticationManager } from '@esri/arcgis-rest-request';

export class Auth implements IAuthenticationManager {
  public  portal: string
  private token: string

  constructor(portal: string, token: string) {
    this.portal = portal;
    this.token = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
  }

  public getToken(): Promise<string> {
    return Promise.resolve(this.token);
  }
}
