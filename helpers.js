import fs from "fs";
import { diff } from "jest-diff";

import * as R from "ramda";

// 😈 I always forget to confirm the auto-import
export const injectRamda = () =>
  Object.entries(R).forEach(([fnName, fn]) => (global[fnName] = fn));

export const pipe =
  (...fns) =>
  (...initParams) =>
    initParams.length > 1
      ? fns.slice(1).reduce((p, f) => f(p), fns[0].apply(this, initParams))
      : fns.reduce((p, f) => f(p), initParams[0]);
export const curry = fn =>
  function curried(...args) {
    return args.length >= fn.length
      ? fn.apply(this, args)
      : (...args2) => curried.apply(this, args.concat(args2));
  };
export const reduce = curry((fn, initialValue, array) =>
  array.reduce(fn, initialValue)
);
export const map = fn => functor => functor.map(fn);
export const flatten = arr => arr.flat(Infinity);
export const apply = fn => args => fn.apply(this, args);
export const filter = curry((predicate, arr) => arr.filter(predicate));
export const complement =
  f =>
  (...args) =>
    !f.apply(this, args);
export const reject = curry((predicate, arr) => arr.filter(i => !predicate(i)));
export const id = id => id;
export const get = p => o => o[p];
export const length = get("length");
export const pluck = p => map(get(p));
export const converge = curry((convergeFn, branchFns, param) =>
  convergeFn.apply(
    this,
    branchFns.map(fn => fn(param))
  )
);
export const list = (...args) => args;
export const transpose = arr =>
  map(col => map(row => row[col])(arr))(Object.keys(arr[0]));
export const K = value => () => value; // aka always
export const every = curry((pred, arr) => arr.every(pred));
export const some = curry((pred, arr) => arr.some(pred));
export const T = true;
export const isTrue = b => b === true;
export const max = arr => Math.max.apply(Math, arr);
export const maxBy =
  f =>
  ([a, b]) =>
    f(b) > f(a) ? b : a;
export const minBy =
  f =>
  ([a, b]) =>
    f(b) < f(a) ? b : a;
export const parseBinary = s => parseInt(s, 2);
export const toNumber = s => Number(s);
export const multiply = curry((a, b) => a * b);
export const tap =
  fn =>
  (...args) =>
    pipe(fn.apply(fn.context, args), K(args));
export const tapLog =
  prefix =>
  (...args) => {
    if (args.length > 1)
      console.warn("Note: tapLog has been called with more than 1 argument");
    console.log(prefix, ...args);
    return args[0];
  };
export const log = m => console.log.bind(console, m);
export const inspect = tapLog("\n\n-- inspect:\n");
export const join = glue => arr => arr.join(glue);
export const trim = s => s.trim();
export const split = delim => string => string.split(delim);
export const splitLines = split("\n");
export const splitChars = split("");
export const splitWords = split(" ");
export const toJson = n => JSON.stringify(n);
export const toBinary = pipe(join(""), parseBinary);
export const getKeysBy = fn =>
  pipe(
    map(Object.entries),
    map(i => {
      if (i.length === 1) return i[0];
      return fn(get(1))(i);
    }),
    pluck(0)
  );
export const getMaxKeys = getKeysBy(maxBy); // something is broken here
export const getMinKeys = getKeysBy(minBy);
export const countValues = arr =>
  arr.reduce((acc, cv) => {
    if (!acc[cv]) acc[cv] = 0;
    acc[cv]++;
    return acc;
  }, {});
export const until = curry((pred, fn, init) => {
  let val = init;
  while (!pred(val)) val = fn(val);
  return val;
});
export const or = curry((a, b) => a || b);
export const equals = curry((a, b) => a === b);
export const deepEquals = (a, b) => toJson(a) === toJson(b);
export const sum = arr => arr.reduce((sum, cv) => sum + cv, 0);
export const removeEmpty = filter(s => s.length !== 0);
export const fromFile = curry((cb, filename) =>
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) throw err;
    cb(data);
  })
);

export const readFile = filename =>
  new Promise(resolve =>
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) throw err;
      resolve(data);
    })
  );

// testing
export const test = (condition, err, ok) => {
  if (condition) {
    console.log(ok);
  }

  if (!condition) {
    console.error("\x1b[31mFAILED:\x1b[0m", ...err);
  }
};

export const expect = result => ({
  toEqual: (expectation, message) =>
    test(
      deepEquals(result, expectation),
      [
        `${message}\n\t${result} is not Equal to ${expectation}:\n`,
        diff(expectation, result),
      ],
      message || `ok: ${result} === ${expectation}`
    ),
});

export const expectEqual = (expectation, message) => result => {
  const resultJson = toJson(result);
  const expectationJson = toJson(expectation);
  const errorMessage = `${message}\n\t${resultJson} is not Equal to ${expectationJson}\n`;

  test(
    deepEquals(result, expectation),
    [errorMessage, diff(expectation, result)],
    message || `${result} === ${expectation}`
  );
};
