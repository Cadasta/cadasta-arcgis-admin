export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret: any = {};
  keys.forEach((key: K) => {
    ret[key] = obj[key]
  });
  return ret;
}

export function requiredPick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret = pick(obj, ...keys);
  const unsetKeys = Object.entries(ret).filter(
    ([key, value]: [string, any]) => ['', undefined].includes(value)
  ).map(([k, v]: [string, any]) => k);
  if (unsetKeys.length) {
    throw new Error(`ERROR: Required keys are unset: ${unsetKeys.join(', ')}`);
  }
  return ret;
};
