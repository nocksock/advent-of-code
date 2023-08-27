import { performance } from "perf_hooks";

type Fn = <T, R>(input: T) => R;
export const debug =
  (label?: string) =>
  <T>(input: T): T => {
    console.log(`(${label || ""})::[${typeof input}]:`, input);
    return input;
  };

export const splitLines = (input: string) => input.split("\n");

export const arrayFromGroupedLines = (input: string) =>
  input.split("\n\n").map(splitLines);

export const tee =
  <T>(fn: (input: T) => any) =>
  (input: T) => {
    fn(input);
    return input;
  };

export const teeLog = tee(console.log);

// const obs = new PerformanceObserver((list) => {
//   list
//     .getEntries()
//     .map((entry) => console.log(`${entry.name}: ${entry.duration}`));
//
//   performance.clearMarks();
//   performance.clearMeasures();
//   obs.disconnect();
// });
// obs.observe({ entryTypes: ["function"] });

// export const measure = <T, R>(
//   label: string,
//   count: number,
//   fn: (input: T) => R
// ) => {
//   return performance.timerify();
// };

export const asAsync =
  <F extends Fn, R>(fn: F) =>
  (input: Parameters<F>) =>
    new Promise((resolve) => resolve(fn(input))) as Promise<R>;

performance.timerify;

export const parallel =
  <F extends Fn>(...fn: F[]) =>
  (input: Parameters<typeof fn[0]>) =>
    Promise.all(fn.map(asAsync).map((fn) => fn(input)));
