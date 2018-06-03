import { UserSession } from "@esri/arcgis-rest-auth";

import { ARCGIS_CLIENT_ID, ARCGIS_PORTAL_URL } from "../config";

const credKey = "__ARCGIS_REST_USER_SESSION__";

export const startOAuth2Flow = (nextEndpoint: string='/') => (
  UserSession.beginOAuth2({
    clientId: ARCGIS_CLIENT_ID,
    portal: ARCGIS_PORTAL_URL,
    popup: false,
    // A redirect may send a user to this view if they were not logged in. That redirect
    // should add a 'next' property to the path's state. This is used to dictate where
    // the ArcGIS Portal sends a user upon successfully authenticating. Defaults to root.
    redirectUri: `${window.location.origin}${nextEndpoint}`,
  })
)

export const completeOAuth2Flow = () => (
  UserSession.completeOAuth2({
    clientId: ARCGIS_CLIENT_ID,
    portal: ARCGIS_PORTAL_URL,
    redirectUri: window.location.origin
  })
)
// export const completeOAuth2Flow = () => {
//   const session = UserSession.completeOAuth2({
//     clientId: ARCGIS_CLIENT_ID,
//     portal: ARCGIS_PORTAL_URL,
//     redirectUri: window.location.origin
//   });
//   localStorage.setItem(credKey, session.serialize());
//   return session;
// }

export const isCompletingLogin = () => {
  if (
    !window.location.href.match(
      /access_token=(.+)&expires_in=(.+)&username=([^&]+)/
    )
  ) {
    return false;
  }
  return completeOAuth2Flow()
};

export const getUserSession = (): UserSession | false => {
  // Handle previously stored credentials
  const serializedSession = localStorage.getItem(credKey);
  if (serializedSession === null || serializedSession === "undefined") {
    return false;
  }

  // If there is a serialized session, parse it and create a new session object.
  const parsed = JSON.parse(serializedSession);
  // Cast the tokenExpires property back into a date.
  parsed.tokenExpires = new Date(parsed.tokenExpires);
  // Create the new session object.
  return new UserSession(parsed);
  // TODO: Validate that the session is not expired, if so refresh token (?)
};
