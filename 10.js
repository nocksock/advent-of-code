import * as aoc from "./helpers.js"
aoc.setup()

const parseFile = pipe(trim, split("\n"))
const isOpening = test(/[\[\{\(\<]/)
const isClosing = test(/[\]\}\)\>]/)
const pair = { "(": ")", "{": "}", "<": ">", "[": "]" }
const points = { ")": 3, "]": 57, "}": 1197, ">": 25137 }
const scores = { ")": 1, "]": 2, "}": 3, ">": 4 }

const findErrorChars = (remaining, tree = [], pos = 0) => {
  while (remaining.length) {
    const [c, ...r] = remaining
    if (isClosing(c) && c !== pair[tree[0]]) throw c
    if (isOpening(c)) remaining = findErrorChars(r, [c, tree], pos + 1)
    if (isClosing(c) && c === pair[tree[0]]) return r
  }

  return remaining
}

const getErrorScore = pipe(tryCatch(findErrorChars, p => points[p]))
const completeBrackets = pipe(
  split(""),
  reduce((acc, cv) => (isClosing(cv) ? acc.slice(1) : [pair[cv], ...acc]), []),
  join("")
)

const getBracketScore = pipe(
  split(""),
  reduce((total, cv) => total * 5 + scores[cv], 0)
)

const getMiddle = converge(nth, [
  pipe(prop("length"), multiply(0.5), Math.floor),
  sort(subtract),
])

const partA = pipe(map(getErrorScore), reject(isNil), sum)
const partB = pipe(
  map(input => {
    try {
      findErrorChars(input)
      return completeBrackets(input)
    } catch {}
  }),
  reject(isNil),
  map(getBracketScore),
  getMiddle
)

// -- RUNNING -----------------------------------------------------------------

aoc
  .readFile("./10.sample")
  .then(parseFile)
  .then(
    pipe(
      tap(pipe(partA, tap(aoc.expectEqual(26397, "Part A, sample: ok")))),
      tap(pipe(partB, aoc.expectEqual(288957, "Part B, sample: ok")))
    )
  )

aoc
  .readFile("./10.input")
  .then(parseFile)
  .then(
    pipe(
      tap(
        pipe(
          partA,
          tap(log("Part A, result:")),
          tap(aoc.expectEqual(392139, "Part A, result: ok"))
        )
      ),
      tap(pipe(partB, tap(log("Part B, result:"))))
    )
  )

// -- TESTS -------------------------------------------------------------------

expect(completeBrackets("[(){")).toEqual("}]")
expect(completeBrackets("[({(<(())[]>[[{[]{<()<>>")).toEqual("}}]])})]")
expect(completeBrackets("[(()[<>])]({[<{<<[]>>(")).toEqual(")}>]})")
expect(completeBrackets("(((({<>}<{<{<>}{[]{[]{}")).toEqual("}}>}>))))")
expect(completeBrackets("{<[[]]>}<{[{[{[]{()[[[]")).toEqual("]]}}]}]}>")
expect(completeBrackets("<{([{{}}[<[[[<>{}]]]>[]]")).toEqual("])}>")
expect(getBracketScore("}}]])})]")).toEqual(288957)
expect(getBracketScore(")}>]})")).toEqual(5566)
expect(getBracketScore("}}>}>))))")).toEqual(1480781)
expect(getBracketScore("]]}}]}]}>")).toEqual(995444)
expect(getBracketScore("])}>")).toEqual(294)
expect(getMiddle([1, 2, 3, 4, 5])).toEqual(3)
