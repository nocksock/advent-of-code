import { readFileSync } from "fs";
import { pipe, map, sum, expect } from "./helpers.js";
console.log(`\n-- DAY 01 --`)

// -- Part A ---------------------------------------------------------------
const inToArr = input => input.split("\n").map(i => parseInt(i, 10))
const countIncrements = input =>
  input.reduce(
    (prev, cv) => ({
      increments: prev.value < cv ? prev.increments + 1 : prev.increments,
      value: cv,
    }),
    { increments: 0 }
  ).increments;

const getIncrements = pipe(inToArr, map(Number), countIncrements);

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

expect(getIncrements(sample)).toEqual(7, "Day 01, Part 1: Sample ok")

// Calculate with actual input
const input = readFileSync("./01.input", "utf-8");
console.log("Day 01, Part 1:", getIncrements(input));

// -- Part B----------------------------------------------------------------
const toTriplets = input =>
  input.reduce((acc, _, i, arr) => {
    if (i + 3 > arr.length) return acc;
    return acc.concat([arr.slice(i, i + 3)]);
  }, []);

const windowedIncrements = pipe(inToArr, toTriplets, map(sum), countIncrements);

expect(windowedIncrements(sample)).toEqual(5, "Day 01, Part 2: Sample ok")
console.log("Day 01, Part 2:", windowedIncrements(input));
