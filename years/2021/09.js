import * as aoc from "./helpers.js"
aoc.setup()

const Grid = g => ({
  map: fn => g.map((rows, y) => rows.map((value, x) => fn([value, [x, y]]))),
  at: ([x, y]) => [g?.[y]?.[x], [x, y]],
  adjacents: ([_pv, [x, y]]) => ([
    Grid(g).at([x, y - 1]),
    Grid(g).at([x + 1, y]),
    Grid(g).at([x, y + 1]),
    Grid(g).at([x - 1, y]),
  ]),
  toString: () => `Grid(${g})`,
})
Grid.of = a => Grid(a)

const parseInput = pipe(
  trim,
  split("\n"),
  map(pipe(split(""), map(Number))),
  Grid.of
)

const lteOrUndefined = value =>
  ([av]) => av !== undefined && av <= value

const findLowCoords = grid =>
  grid
    .map(([value, coords]) =>
      any(lteOrUndefined(value), grid.adjacents([value, coords])) ? false : coords
    )
    .flat()
    .filter(identity)

const pointIsValid = ([pv]) => pv !== undefined
const pointIsBasin = ([pv]) => pv !== 9
const pointWasNotVisited = hist => ([_, coord]) => hist[coord] === undefined
const getBasin = grid => function recurseBasin(point, history = {}) {
  grid
    .adjacents(point)
    .filter(pointIsValid)
    .filter(pointIsBasin)
    .filter(pointWasNotVisited(history))
    .map(point => {
      history[point[1].join(",")] = point
      return recurseBasin(point, history)
    })

  return history
}

const partA = pipe(
  grid => findLowCoords(grid).map(grid.at),
  pluck(0),
  flatten,
  map(add(1)),
  sum
)

const partB = pipe(
  grid => findLowCoords(grid).map(pipe(grid.at, getBasin(grid))),
  map(pipe(Object.values, prop("length"))),
  sort(subtract),
  reverse,
  slice(0, 3),
  product
)

readFile("09.sample")
  .then(parseInput)
  .then(
    juxt([
      pipe(partA, expectEqual(15, "Day 09, Part A sample: Ok")),
      pipe(partB, expectEqual(1134, "Day 09, Part B sample: Ok")),
    ])
  )

readFile("09.input")
  .then(parseInput)
  .then(
    pipe(
      juxt([
        pipe(
          partA,
          tap(log("Day 09, Part A result:")),
          tap(expectEqual(506, "Day 09, Part result: ok"))
        ),
        pipe(
          partB,
          tap(log("Day 09, Part B result:")),
          tap(expectEqual(931200, "Day 09, Part result: ok"))
        ),
      ])
    )
  )
