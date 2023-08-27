import * as aoc from "./helpers.js"
aoc.setup()

// -- METHODS ---------------------------------------------------------------{{{
const parseFile = pipe(
  trim,
  split("\n\n"),
  converge(
    (template, rules) => ({
      template,
      rules: mergeAll(fromPairs(rules)),
    }),
    [nth(0), pipe(nth(1), split("\n"), map(split(" -> ")))]
  )
)

const make = ({ template, rules }) => {
  let result = ""
  let remaining = template

  while (remaining.length > 0) {
    let [pair, _remain] = splitAt(2, remaining)

    if (rules[pair]) {
      pair = insert(1, rules[pair], pair).join("")
      _remain = pair.slice(-1) + _remain
      pair = pair.slice(0, 2)
    }

    remaining = _remain
    result += pair
  }

  return result
}

const countAndSort = pipe(
  split(""),
  countBy(identity),
  Object.entries,
  sortBy(pipe(nth(1))),
)

const getMostCommonCount = pipe(
  countAndSort,
  head,
  nth(1)
)

const getLeastCommonCount = pipe(
  countAndSort,
  last,
  nth(1)
)
// }}}

// -- RUNNING ---------------------------------------------------------------{{{
aoc
  .readFile("14.sample")
  .then(parseFile)
  .then(
    pipe(
      input =>
        reduce(
          last => make({ template: last, rules: input.rules }),
          input.template,
          range(0, 10)
        ),
      converge(subtract, [getLeastCommonCount, getMostCommonCount]),
      expectEqual(1588, "Part 1, sample: ok")
    )
  )

aoc
  .readFile("14.input")
  .then(parseFile)
  .then(
    pipe(
      input =>
        reduce(
          last => make({ template: last, rules: input.rules }),
          input.template,
          range(0, 10)
        ),
      converge(subtract, [getLeastCommonCount, getMostCommonCount]),
      tap(log("Part 1, reult:"))
    )
  )
// }}}

// -- TESTING ---------------------------------------------------------------{{{
// }}}
