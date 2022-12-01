import * as aoc from "./helpers.js"
import t from "tap"
aoc.setup()

const makeGrid = pipe(trim, split("\n"), map(pipe(split(""), map(Number))))
const renderGrid = pipe(map(join("")), join("\n"))
const pointValue = ([x, y]) => compose(lensIndex(y), lensIndex(x))
const validCoords =
  grid =>
  ([x, y]) =>
    y >= 0 && x >= 0 && y < grid?.length && x < grid?.[y]?.length

const getAdjacents = ([x, y], grid) =>
  [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y - 1],
    [x + 1, y - 1],
    [x + 1, y + 1],
    [x - 1, y + 1],
  ].filter(validCoords(grid))

const chargeAdjacents = (coord, grid, flashed) =>
  getAdjacents(coord, grid).reduce(
    (prevGrid, coord) => charge(coord, prevGrid, flashed),
    grid
  )

const charge = (coord, grid, flashed) => {
  if (view(pointValue(coord), grid) === 9) {
    flashed[coord] = true
    return chargeAdjacents(coord, set(pointValue(coord), 0, grid), flashed)
  }

  if (!flashed[coord]) {
    return over(pointValue(coord), add(1), grid)
  }

  return grid
}

const runSim = (grid, stepcount) => {
  let flashCount = 0
  const resultGrid = range(0, stepcount).reduce((prevGrid, step) => {
    const flashed = {}

    prevGrid.map((row, y) => {
      row.map((_col, x) => {
        prevGrid = charge([x, y], prevGrid, flashed)
      })
    })

    flashCount += Object.keys(flashed).length
    return prevGrid
  }, grid)

  return { flashCount, grid: resultGrid }
}

// -- GETTING THE RESULTS -----------------------------------------------------

const partA = pipe(
  grid => runSim(grid, 100).flashCount,
  result => console.log("Part A, result: ", result)
)

const partB = pipe(
  grid => {
    const target = propEq("flashCount", grid.length * grid[0].length)
    let step = 0

    until(
      target,
      grid => {
        step++
        return runSim(grid.grid, 1)
      },
      runSim(grid, 0)
    )

    return step
  },
  result => console.log("Part B, Result: ", result)
)

readFile("./11.input")
  .then(makeGrid)
  .then(juxt([partA, partB]))

// -- TESTS -------------------------------------------------------------------
const runSampleStep = input => sampleStep => {
  const [header, ...exp] = sampleStep.split("\n")
  const expectation = exp.join("\n")
  const steps = parseInt(header.slice(-3, -1))
  t.equal(renderGrid(runSim(input, steps).grid), expectation, `Steps ${steps}`)
}

Promise.all([readFile("11.sample"), readFile("11.sample.steps")]).then(
  ([sample, sampleSteps]) => {
    const input = makeGrid(sample)
    sampleSteps.split("\n\n").slice(0, 10).map(runSampleStep(input))

    t.equal(
      runSim(input, 10).flashCount,
      204,
      "Part A, sample: flashtest 10 ok"
    )
    t.equal(
      runSim(input, 100).flashCount,
      1656,
      "Part A, sample: flashtest 100 ok"
    )
  }
)
