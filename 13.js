import * as R from "ramda"
import t from "tap"
import { readFile, expectEqual, tapLog } from "./helpers.js"
import gridMerge from "./13.gridMerge.js"

Object.assign(globalThis, R)

// --- IMPLEMENTATIONS ----------------------------------------------------------------------

const $ = (v, ...fns) => pipe(...fns)(v)
const point = ([x, y]) => compose(lensIndex(y), lensIndex(x))
const strToGrid = pipe(split("\n"), map(split("")))
const makeGrid = ([mx, my]) => times(() => new Array(mx + 1).fill("."), my + 1)
const renderGrid = pipe(map(join("")), join("\n"))
const findMaxCoords = reduce(
  ([mx, my], [x, y]) => [Math.max(mx, x), Math.max(my, y)],
  [-1, -1]
)
const addCoords = reduce((grid, coord) => set(point(coord), "#", grid))
const parseCoords = pipe(
  split("\n"),
  map(pipe(split(","), map(Number))),
  converge(addCoords, [pipe(findMaxCoords, makeGrid), identity])
)
const parseFoldings = pipe(
  split("\n"),
  map(input => {
    const [_, axis, c] = match(/([xy])=(\d+)/, input)
    return { axis, c: Number(c) }
  })
)
const cutAt = curry((n, arr) => pipe(remove(n, 1), splitAt(n))(arr))
const countMarks = pipe(flatten, countBy(identity), prop("#"))
const mirrorY = pipe(reverse)
const mirrorX = pipe(transpose, reverse, transpose)

const applyFoldings = ([grid, folds]) =>
  folds.reduce((grid, { axis, c }) => {
    if (axis === "y") {
      let [a, b] = cutAt(c, grid)
      const merged = gridMerge(a, mirrorY(b))
      return merged
    }

    let [a, b] = reduce(
      ([a, b], row) => {
        const [l, r] = cutAt(c, row)
        return [a.concat([l]), b.concat([r])]
      },
      [[], []],
      grid
    )

    return gridMerge(a, mirrorX(b))
  }, grid)

const parseInput = pipe(
  trim,
  split("\n\n"),
  juxt([pipe(nth(0), parseCoords), pipe(nth(1), parseFoldings)])
)

const partA = pipe(
  ([coords, folds]) => [coords, folds.slice(0, 1)],
  applyFoldings,
  countMarks
)

const partB = pipe(applyFoldings)

// -- RUNNING --------------------------------------------------------------

readFile("13.sample")
  .then(parseInput)
  .then(
    juxt([
      pipe(partA, expectEqual(17, "Part A, sample: ok")),
      pipe(partB, renderGrid, tapLog("Part B, sample:")),
    ])
  )

readFile("13.input")
  .then(parseInput)
  .then(
    juxt([
      pipe(partA, tapLog("Part A, result:")),
      pipe(partB, renderGrid, tapLog("Part B, result")),
    ])
  )

// -- TESTS ----------------------------------------------------------------

t.test("split and merges", t => {
  const tTrim = pipe(trim, replace(/[\t ]/g, ""))
  let tests = [
    {
      name: "setup test",
      input: `
          .....
          .....
          .....
          .....
          .....
        `,
      folds: [],
      expectation: `
          .....
          .....
          .....
          .....
          .....
        `,
    },
    {
      name: "simple y fold",
      input: `
          ..#.
          ..#.
          ....
          ....
          .#..
        `,
      folds: [{ axis: "y", c: 2 }],
      expectation: `
          .##.
          ..#.
        `,
    },
  ]

  tests.map(({ input, folds, expectation, name }) => {
    t.same(
      $(
        tTrim(input),
        strToGrid,
        grid => applyFoldings([grid, folds]),
        renderGrid
      ),
      tTrim(expectation),
      name
    )
  })

  t.end()
})
