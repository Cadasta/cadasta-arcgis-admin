export const responseBodyFactory = (responseBody: object): Body => ({
  bodyUsed: true,
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)), // TODO
  blob: () => Promise.resolve(new Blob()), // TODO
  formData: () => Promise.resolve(new FormData), // TODO
  json: () => Promise.resolve(responseBody),
  text: () => Promise.resolve(JSON.stringify(responseBody)),
});

export const userResponseFactory = (userDetails = {}) => responseBodyFactory(
  {
    username: 'factoryUser',
    role: 'org_admin',
    disabled: false,
    ...userDetails
  }
);
