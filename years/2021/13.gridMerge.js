import * as R from "ramda"
import t from "tap"

Object.assign(globalThis, R);

const isMarked = v => v === '#';
const strToGrid = pipe(split("\n"), map(split("")))
const renderGrid = pipe(map(join("")), join("\n"))

const gridMerge = (a, b) => {
  const [top, flat] = sortBy(prop('length'), [a, b]) // defining that flat is always larger
  const rowsToFill =  flat.length - top.length;
  const filler = repeat(repeat('.', flat[0].length), rowsToFill)
  const filledTop = filler.concat(top)

  return flat.map((row, y) =>
    row.map((v, x) => (any(isMarked, [v, filledTop[y][x]]) ? "#" : "."))
  )
}

export default gridMerge

// -- TESTS ----------------------------------------------------------------

t.test("gridMerge", t => {
  const tTrim = pipe(trim, replace(/[\t ]/g, ""))
  const $ = (v, ...fns) => pipe(...fns)(v);

  t.same(
    $(
      gridMerge(
        strToGrid(      `...\n.#.`),
        strToGrid(`...\n.#.\n.#.`),
      ),
      renderGrid,
    ),
    `...\n.#.\n.#.`
  )

  t.same(
    $(
      gridMerge(
        strToGrid(      `....\n.#..`),
        strToGrid(`..#.\n..#.\n..#.`),
      ),
      renderGrid
    ),
    `..#.\n..#.\n.##.`
  )

  t.same(
    $(
      gridMerge(
        strToGrid(`....\n.#..\n....\n....`),
        strToGrid(      `..#.\n..#.\n..#.`),
      ),
      renderGrid
    ),
    `....\n.##.\n..#.\n..#.`
  )
  t.end();
})
