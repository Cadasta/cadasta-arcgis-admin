export const secondsToString = (seconds: number): string => [
  [seconds / 86400, 'day'],
  [((seconds % 31536000) % 86400) / 3600, 'hour'],
  [(((seconds % 31536000) % 86400) % 3600) / 60, 'minute'],
  [(((seconds % 31536000) % 86400) % 3600) % 60, 'second']
].map(
  ([val, descr]: [number, string]) => [Math.floor(val), descr]
).filter(
  ([val, descr]: [number, string]) => val > 0
).map(
  ([val, descr]: [number, string]) => `${Math.floor(val)} ${val > 1 ? descr + 's' : descr}`
).join(', ');
