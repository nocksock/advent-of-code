import { readFile } from "fs/promises";
import {
  flatten,
  lensIndex,
  equals,
  lensPath,
  map,
  pipe,
  prop,
  set,
  split,
  sum,
  tap,
  trim,
  view,
  gt,
  lt,
  product,
  concat,
  juxt,
} from "ramda";

// note to self... don't do aoc late in the evening. too many brain farts

console.clear();

const pivot = <T extends any[][]>(arr: T) =>
  arr[0].map((_, ri) => arr.map((col) => col[ri]).reverse());

const MASK = 200;

const toGrid = pipe(trim, split("\n"), map(pipe(split(""), map(Number))));

const scanRow = (input: number[]) =>
  input.reduce(
    // this is an absolute mess... welp.
    ({ visibles, highest, input }, tree, index) => {
      const size = tree >= MASK ? tree - MASK : tree,
        wasCounted = tree >= MASK,
        current = lensIndex<number>(index),
        isVisible = size > highest;

      return {
        visibles: wasCounted || !isVisible ? visibles : visibles + 1,
        highest: isVisible ? size : highest,
        input:
          isVisible && !wasCounted ? set(current, tree + MASK, input) : input,
      };
    },
    { visibles: 0, highest: -1, input }
  );

const scanGrid = (input: number[][]) => {
  let trees = input;
  let results = [];

  for (let i = 0; i < 4; i++) {
    const res = trees.map(scanRow);
    const newrow = res.map(prop("input"));
    trees = pivot(newrow);
    results.push(res);
  }

  return results;
};

const countVisibles = pipe(flatten, map(prop("visibles")), sum);

type Callback<R> = (
  value: number,
  [x, y]: [number, number],
  grid: number[][]
) => R;

const eachCell =
  <T extends Callback<R>, R>(fn: T) =>
  (grid: number[][]) =>
    grid.map((row, y) => row.map((cell, x) => fn(cell, [x, y], grid)));

const MOVEMENTS: Vector[] = [
  [0, 1],
  [0, -1],
  [-1, 0],
  [1, 0], // should've used this in A too instead of pivoting.
];

type Vector = [x: number, y: number];
type Grid = number[][];

// function* untilEnd([vx, vy]: Vector, [px, py]: Vector, grid: Grid) {
//   const maxY = grid.length;
//   const maxX = grid[0].length;
//   const steps = (vx > 0 ? maxX - px : px) + (vy > 0 ? maxY - py : py);
//
//   for (let step = 1; step < steps; step++) {
//     const other = grid?.[py + step * vy]?.[px + step * vx];
//     if (!other) continue;
//     yield other;
//   }
// }
//
// const findBestSpot = eachCell((currentTree, pos, grid) =>
//   MOVEMENTS.reduce(
//     ({ sum, highest }, dir) => {
//       let count = 0;
//         console.log("--",{pos, currentTree, dir})
//       for (const other of untilEnd(dir, pos, grid)) {
//         console.log({other})
//         if (other >= highest) break;
//         count++;
//       }
//       return { sum: concat(sum, [count]), highest };
//     },
//     { sum: [] as number[], highest: currentTree }
//   ).sum
// );

readFile("../08.sample", "ascii").then(
  juxt([
    pipe(toGrid, scanGrid, countVisibles, console.log),
    // pipe(toGrid, findBestSpot, console.log),
  ])
);

readFile("../08.input", "ascii").then(
  pipe(toGrid, scanGrid, countVisibles, console.log)
);

// second try... much simpler
const input = await readFile("../08.input", "ascii");

const table = toGrid(input);
const scores = [];

for (let i = 1; i < table.length - 1; i++) {
  for (let j = 1; j < table[0].length - 1; j++) {
    const current = table[i][j];

    const left = table[i].slice(0, j);
    const right = table[i].slice(j + 1);

    const top = table.reduce((acc, row, index) => {
      if (index < i) acc.push(row[j]);
      return acc;
    }, []);

    const bottom = table.reduce((acc, row, index) => {
      if (index > i) acc.push(row[j]);
      return acc;
    }, []);

    const isVisible = [left, right, top, bottom].some((row) => row.every((i) => i < current));

    if (!isVisible) continue;

    const viewReducer = (acc: any, item: number, index: number, arr: any[]) => {
      acc++;
      if (current <= item) {
        arr.splice(index);
      }
      return acc;
    };

    const leftView = left.reverse().reduce(viewReducer, 0);
    const rightView = right.reduce(viewReducer, 0);
    const topView = top.reverse().reduce(viewReducer, 0);
    const bottomView = bottom.reduce(viewReducer, 0);
    const score = leftView * rightView * topView * bottomView;
    scores.push(score);
  }
}
const maxScore = Math.max(...scores);
console.log({ result: maxScore });

// printGrid(input)
// printResult(scanGrid(input));
