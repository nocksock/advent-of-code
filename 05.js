import {
  map,
  range,
  repeat,
  zip,
  filter,
  flatten,
  join,
  transpose,
  tap,
  pipe,
  prop,
} from "ramda";
import { expect, readFile } from "./helpers.js";

console.log("\n\n-- DAY 05--");
const parseInput = s =>
  s
    .trim()
    .split("\n")
    .map(l =>
      l
        .split(",")
        .flatMap(l => l.split(" -> "))
        .flatMap(Number)
    )
    .map(l => [
      [l[0], l[1]],
      [l[2], l[3]],
    ]);

const arrayPad = (a, l, f) =>
  a.length > l ? a : a.concat(Array(l).fill(f)).slice(0, l);
const isStraight = ([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2;

const getRange = (from, to) => {
  if (from < to) return range(from, to + 1);
  if (from > to) return range(to, from + 1).reverse();
  return [from];
};

expect(getRange(5, 3)).toEqual([5, 4, 3], "getRange()");
expect(getRange(3, 5)).toEqual([3, 4, 5], "getRange()");
expect(getRange(0, 0)).toEqual([0], "getRange()");

const coords = (from, to) => {
  let xRange = getRange(from[0], to[0]);
  let yRange = getRange(from[1], to[1]);
  if (xRange.length === 1) xRange = repeat(xRange[0], yRange.length);
  if (yRange.length === 1) yRange = repeat(yRange[0], xRange.length);
  return zip(xRange, yRange);
};

const drawMap = lines =>
  lines.reduce((map, line) => {
    const [from, to] = line;

    coords(from, to).forEach(([x, y]) => {
      if (!map[x]) {
        map = arrayPad(map, x + 1, []);
      }

      map = map.map(row => arrayPad(row, y + 1, 0));
      map[x][y]++;
    });

    return map;
  }, []);

const render = pipe(
  transpose,
  map(join(" ")),
  join("\n"),
  tap(m => console.log(m))
);

const countOverlaps = min =>
  pipe(
    flatten,
    filter(n => n >= min),
    prop("length")
  );

readFile("./05.sample").then(
  pipe(parseInput, filter(isStraight), drawMap, countOverlaps(2), result =>
    expect(result).toEqual(5, "Day 05, Part A: Sample ok")
  )
);

readFile("./05.sample").then(
  pipe(parseInput, drawMap, tap(render), countOverlaps(2), result =>
    expect(result).toEqual(12, "Day 05, Part B: Sample ok")
  )
);

readFile("./05.input").then(
  pipe(parseInput, filter(isStraight), drawMap, countOverlaps(2), result =>
    console.log("Day 05, Part A Result: ", result)
  )
);

readFile("./05.input").then(
  pipe(parseInput, drawMap, countOverlaps(2), result =>
    console.log("Day 05, Part B Result: ", result)
  )
);
