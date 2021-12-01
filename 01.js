import { readFileSync } from "fs";
import { pipe, inToArr, map, sum } from "./helpers.js";

// -- Part A ---------------------------------------------------------------
const countIncrements = input =>
  input.reduce(
    (prev, cv) => ({
      increments: prev.value < cv ? prev.increments + 1 : prev.increments,
      value: cv,
    }),
    { increments: 0 }
  ).increments;

const getIncrements = pipe(inToArr, countIncrements);

// Verify via sample
const sample = `199
200
208
210
200
207
240
269
260
263`;

console.assert(getIncrements(sample) === 7, "sample does not expectation");

// Calculate with actual input
const input = readFileSync("./01.input", "utf-8");
console.log("Day 1, Part 1:", getIncrements(input));

// -- Part B----------------------------------------------------------------
const toTriplets = input =>
  input.reduce((acc, _, i, arr) => {
    if (i + 3 > arr.length) return acc;
    return acc.concat([arr.slice(i, i + 3)]);
  }, []);

const windowedIncrements = pipe(inToArr, toTriplets, map(sum), countIncrements);

console.assert(windowedIncrements(sample) === 5, "sample does not expectation");
console.log("Day 1, Part 2:", windowedIncrements(input));
