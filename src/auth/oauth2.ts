import { UserSession } from "@esri/arcgis-rest-auth";

import { ARCGIS_CLIENT_ID, ARCGIS_PORTAL_URL } from "../config";

export const startOAuth2Flow = (nextEndpoint: string = "/") =>
  UserSession.beginOAuth2({
    clientId: ARCGIS_CLIENT_ID,
    portal: ARCGIS_PORTAL_URL,
    popup: false,
    // A redirect may send a user to this view if they were not logged in. That redirect
    // should add a 'next' property to the path's state. This is used to dictate where
    // the ArcGIS Portal sends a user upon successfully authenticating. Defaults to root.
    redirectUri: `${window.location.origin}${nextEndpoint}`
  });

export const completeOAuth2Flow = () =>
  UserSession.completeOAuth2({
    clientId: ARCGIS_CLIENT_ID,
    portal: ARCGIS_PORTAL_URL,
    redirectUri: window.location.origin
  }).serialize()

export const isCompletingLogin = () => {
  return window.location.href.match(
    /access_token=(.+)&expires_in=(.+)&username=([^&]+)/
  );
};

// TODO: Validate that the session is not expired, if so refresh token (?)
