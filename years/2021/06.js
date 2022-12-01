import { pipe, split, trim } from "ramda";
import { expect, readFile, tapLog } from "./helpers.js";
const initial = [3, 4, 3, 1, 2];

const step = arr =>
  arr
    .map(life => (life === 0 ? 6 : life - 1))
    .concat(Array(arr.filter(life => life === 0).length).fill(8));

const calculate = (day, set) =>
  day === 0 ? set : calculate(day - 1, step(set));

expect(calculate(18, initial).length).toEqual(
  26,
  "Day 06, Part A: Sample 1 ok"
);

expect(calculate(80, initial).length).toEqual(
  5934,
  "Day 06, Part A: Sample 1 ok"
);

readFile("./06.input").then(
  pipe(
    trim,
    split(","),
    initial => calculate(80, initial).length,
    tapLog("Day 06, Part A Result: ")
  )
);
