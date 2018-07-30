// Create mock object that simulates the response of `new SimpleDB().someMethod(args).promise()`
export const mockAwsMethodPromiseObject = (prototype: {
  [method: string]: any;
}): { [key: string]: jest.Mock } =>
  Object.assign(
    {},
    ...Object.entries(prototype).map(([method, mock]: [string, jest.Mock]) => ({
      [method]: jest.fn(() => ({
        promise: mock
      }))
    }))
  );
