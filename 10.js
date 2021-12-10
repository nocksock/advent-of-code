import * as aoc from "./helpers.js"
aoc.setup()

const parseFile = pipe(trim, split("\n"))
const isOpening = test(/[\[\{\(\<]/)
const isClosing = test(/[\]\}\)\>]/)
const pair = { "(": ")", "{": "}", "<": ">", "[": "]" }
const points = { ")": 3, "]": 57, "}": 1197, ">": 25137 }
const scores = { ")": 1, "]": 2, "}": 3, ">": 4 }

const findErrorChars = pipe(
  split(""),
  reduceWhile(
    n => typeof n !== "string",
    (acc, cv) => {
      if (isClosing(cv) && cv !== head(acc)) return cv
      if (isClosing(cv)) return slice(1, Infinity, acc)
      return [pair[cv], ...acc]
    },
    []
  )
)

const completeBrackets = pipe(
  split(""),
  reduce((acc, cv) => (isClosing(cv) ? acc.slice(1) : [pair[cv], ...acc]), []),
  join("")
)

const getBracketScore = pipe(
  split(""),
  reduce((total, cv) => total * 5 + scores[cv], 0)
)

const getMiddleValue = converge(nth, [
  pipe(prop("length"), multiply(0.5), Math.floor),
  sort(subtract),
])

const partA = pipe(
  map(findErrorChars),
  reject(r => typeof r === "object"),
  map(c => points[c]),
  sum
)

const partB = pipe(
  reduce(
    (acc, input) => 
      typeof findErrorChars(input) === "object" 
        ? acc.concat(completeBrackets(input))
        : acc
    , []),
  map(getBracketScore),
  getMiddleValue
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
      tap(
        pipe(
          partB,
          tap(log("Part B, result:")),
          tap(expectEqual(4001832844, "PartB, result: ok"))
        )
      )
    )
  )

// -- TESTS -------------------------------------------------------------------
expect(findErrorChars("{([(<{}[<>[]}>{[]{[(<()>")).toEqual("}")
expect(findErrorChars("[[<[([]))<([[{}[[()]]]")).toEqual(")")
expect(findErrorChars("[{[{({}]{}}([{[{{{}}([]")).toEqual("]")
expect(findErrorChars("[<(<(<(<{}))><([]([]()")).toEqual(")")
expect(findErrorChars("<{([([[(<>()){}]>(<<{{")).toEqual(">")
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
expect(getMiddleValue([1, 2, 3, 4, 5])).toEqual(3)
