import * as aoc from "./helpers.js"

aoc.setup()

const Grid = init => ({
  map: fn => init.map((rows, y) => rows.map((value, x) => fn(value, [x, y]))),
  at: (x, y) => init?.[y]?.[x],
  n: (x, y) => Grid(init).at(x, y - 1),
  e: (x, y) => Grid(init).at(x + 1, y),
  s: (x, y) => Grid(init).at(x, y + 1),
  w: (x, y) => Grid(init).at(x - 1, y),
  of: array => Grid(array),
  toString: () => `Grid(${init})`,
  adjacents: (x, y) => [
    Grid(init).n(x, y),
    Grid(init).e(x, y),
    Grid(init).s(x, y),
    Grid(init).w(x, y),
  ],
})
Grid.of = a => Grid(a)

const parseInput = pipe(
  trim,
  split("\n"),
  map(pipe(split(""), map(Number))),
  Grid.of
)

const findLowPoints = grid =>
  grid
    .map((value, [x, y]) =>
      filter(a => a !== undefined && a <= value, grid.adjacents(x, y)).length > 0
        ? false
        : [x, y]
    )
    .flat()
    .filter(identity)

// const notEnd = v => !isFlagged(v) && ![undefined, 9].includes(v)
// const findBasins = flaggedGrid => {
//   const cursor = makeCursor(flaggedGrid);
//   return flaggedGrid.map((row, y) => {
//     return row.map((value, x) => {
//       if (isFlagged(value)) {
//         return walk(Grid(flaggedGrid), cursor, x, y, [value])
//       }
//     })
//   })
// }

const partA = pipe(
  converge(
    (lp, grid) => lp.map(pipe(apply(grid.at))),
    [findLowPoints, identity]
  ),
  map(add(1)), sum
)

readFile("09.sample")
  .then(parseInput)
  .then(pipe(partA, expectEqual(15, "Day 09, Part A sample: Ok")))

readFile("09.input")
  .then(parseInput)
  .then(
    pipe(
      partA,
      tap(log("Day 09, Part A result:")),
      tap(expectEqual(506, "Day 09, Part result: ok"))
    )
  )
