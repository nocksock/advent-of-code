import { pipe, range, repeat, sum, trim, split } from "ramda";
import { expect, readFile, tapLog } from "./helpers.js";

const initial = [3, 4, 3, 1, 2];

const makePool = nums =>
  nums.reduce((pool, num) => {
    pool[num] += 1;
    return pool;
  }, repeat(0, 9));

const iterate = (days, initial) =>
  range(0, days).reduce(pool => {
    const [births, ...tail] = pool;
    tail[6] += births;
    return [...tail, births];
  }, makePool(initial));

const calculate = pipe(iterate, sum);

readFile("./06.input").then(
  pipe(
    trim,
    split(","),
    initial => calculate(256, initial),
    tapLog("Day 06, Part B Result: ")
  )
);

// -- TESTS ----------------------------------------------------------------
expect(makePool(initial)).toEqual(
  [0, 1, 1, 2, 1, 0, 0, 0],
  "makePool() works as intended"
);
expect(calculate(0, initial)).toEqual(5, "0 days ok ");
expect(calculate(1, initial)).toEqual(5, "1 days ok ");
expect(calculate(2, initial)).toEqual(6, "2 days ok ");
expect(calculate(3, initial)).toEqual(7, "3 days ok ");
expect(calculate(4, initial)).toEqual(9, "4 days ok ");
expect(calculate(5, initial)).toEqual(10, "5 days ok ");
expect(calculate(6, initial)).toEqual(10, "6 days ok ");
expect(calculate(7, initial)).toEqual(10, "7 days ok ");
expect(calculate(8, initial)).toEqual(10, "8 days ok ");
expect(calculate(9, initial)).toEqual(11, "9 days ok ");
expect(calculate(10, initial)).toEqual(12, "10 days ok ");
expect(calculate(11, initial)).toEqual(15, "11 days ok ");
expect(calculate(18, initial)).toEqual(26, "Day 06, Part A: Sample 1 ok");
expect(calculate(80, initial)).toEqual(5934, "Day 06, Part A: Sample 1 ok");
expect(calculate(256, initial)).toEqual(
  26984457539,
  "Day 06, Part B: Sample 1 ok"
);
