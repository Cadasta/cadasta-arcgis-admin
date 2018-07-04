import { IAuthenticationManager } from '@esri/arcgis-rest-request';

export default class Auth implements IAuthenticationManager {
  public  portal: string
  private token: string
   
  constructor(token: string) {
    this.token = token.substring(7);
  }
  
  public getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(this.token);
    });
  }
}