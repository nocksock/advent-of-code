import {
  apply,
  identity,
  juxt,
  map,
  memoizeWith,
  pipe,
  range,
  split,
  sum,
  times,
  trim,
} from "ramda";
import { expectEqual, readFile, tapLog } from "./helpers.js";

console.log("\n\n=== Day 07 ===\n");

const parseFile = pipe(trim, split(","), map(Number));
const factorial = memoizeWith(identity, n => sum(range(1, n + 1)));
// yeah I know, that's not factorial, but it's quite similar. There's probably a
// name for this too, which I don't know.

// this could probably be composed more elegantly
const calculateWith = fn => input =>
  apply(
    Math.min,
    times(
      target =>
        input.reduce((cost, pos) => cost + fn(Math.abs(pos - target)), 0),
      apply(Math.max, input)
    )
  );

const calcSum = calculateWith(identity);
const calcFac = calculateWith(factorial);

readFile("./07.sample").then(
  pipe(
    parseFile,
    juxt([
      pipe(calcSum, expectEqual(37, "Sample A: Ok")),
      pipe(calcFac, expectEqual(168, "Sample B: Ok")),
    ])
  )
);

readFile("./07.input").then(
  pipe(
    parseFile,
    juxt([
      pipe(calcSum, tapLog("Result A:")),
      pipe(calcFac, tapLog("Result B:")),
    ])
  )
);
