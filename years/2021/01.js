import * as aoc from "./helpers.js"
aoc.setup()

// --- IMPLEMENTATIONS ----------------------------------------------------------------------

const parseFile = pipe(s => s.trim(), split("\n"), reject(isNil), map(Number))

const countIncrements = input =>
  input.reduce(
    (prev, cv) => ({
      increments: prev.value < cv ? prev.increments + 1 : prev.increments,
      value: cv,
    }),
    { increments: 0 }
  ).increments

const toTriplets = input =>
  input.reduce((acc, _, i, arr) => {
    if (i + 3 > arr.length) return acc
    return acc.concat([arr.slice(i, i + 3)])
  }, [])

const windowedIncrements = pipe(toTriplets, map(sum), countIncrements)

// --- RUNNING ----------------------------------------------------------------------

readFile("./01.sample")
  .then(parseFile)
  .then(
    juxt([
      pipe(countIncrements, expectEqual(7, "Part 1: Sample ok")),
      pipe(windowedIncrements, expectEqual(5, "Part 2: Sample ok")),
    ])
  )

readFile("./01.input")
  .then(parseFile)
  .then(
    juxt([
      pipe(countIncrements, log("Part 1, Result:")),
      pipe(windowedIncrements, log("Part 2, Result:")),
    ])
  )
