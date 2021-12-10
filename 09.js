import * as aoc from "./helpers.js"
import { writeFile } from "fs/promises"
import { multiply, subtract } from "ramda"

aoc.setup()

const flag = n => 0b1_0000 | n
const unflag = n => 0b1_0000 ^ n
const isFlagged = n => (n & (1 << 4)) != 0

const Grid = init => ({
  map: (fn) => init.map((rows, y) => rows.map((value, x) => fn(value, [x, y]))),
  at: (x, y) => init?.[x]?.[y],
  n: (x, y) => Grid(init).at(x, y - 1),
  e: (x, y) => Grid(init).at(x + 1, y),
  s: (x, y) => Grid(init).at(x, y + 1),
  w: (x, y) => Grid(init).at(x - 1, y),
  of: array => Grid(array),
  toString: () => `Grid(${init})`,
  adjacents: (x, y) => ([
    Grid(init).n(x, y),
    Grid(init).e(x, y),
    Grid(init).s(x, y),
    Grid(init).w(x, y)
  ])
})
Grid.of = a => Grid(a)

const parseInput = pipe(trim, split("\n"), map(pipe(split(""), map(Number))), Grid.of)
const calcRisk = pipe(flatten, filter(isFlagged), map(unflag), map(add(1)), sum)

const ltOrUndef = value => n => n === undefined || n <= value
const flagLowPoints = grid =>
  grid.map((value, [x, y]) => {
    return any(ltOrUndef(value), grid.adjacents(x, y)) ? value : value
  })

const notEnd = v => !isFlagged(v) && ![undefined, 9].includes(v)

const walk = (grid, cursor, x, y, values = []) => {
  const adjacents = grid.adjancents(x, y).filter(notEnd)

  values.concat(adjacents)

  // if (notEnd(x, y - 1, n))
  //   return walk(grid, cursor, x, y-1, values)

  // if (notEnd(x + 1, y, e)) 
  //   return walk(grid, cursor, x+1, y, values)

  // if (notEnd(x - 1, y, w)) 
  //   return walk(grid, cursor, x-1, y, values)

  // if (notEnd(x, y + 1, s)) 
  //   return walk(grid, cursor, x, y+1, values)

  return values.flat(Infinity).map(unflag);
}

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

readFile("09.sample")
  .then(parseInput)
  .then(
    pipe(flagLowPoints, inspect, calcRisk, expectEqual(15, "Day 09, Part A sample: Ok")),
    // pipe(flagLowPoints, findBasins, inspect)
  )

readFile("09.input")
  .then(parseInput)
  .then(
    // pipe(
    //   flagLowPoints,
    //   calcRisk,
    //   tap(log("Day 09, Part A result:")),
    //   tap(expectEqual(506, "Day 09, Part result: ok"))
    // )
  )
