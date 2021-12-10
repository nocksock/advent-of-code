import { tryCatch } from "ramda"
import * as aoc from "./helpers.js"
import t from "tap"

aoc.setup()

const parseFile = pipe(trim, split("\n"))
const isOpening = test(/[\[\{\(\<]/)
const isClosing = test(/[\]\}\)\>]/)

const pair = {
  "(": ")",
  "{": "}",
  "<": ">",
  "[": "]",
}
const points = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
}

const walk = (remaining, tree = [], pos = 0) => {
  while (remaining.length) {
    const [c, ...r] = remaining
    if (isClosing(c) && c !== pair[tree[0]]) throw c
    if (isOpening(c)) remaining = walk(r, [c, tree], pos + 1)
    if (isClosing(c) && c === pair[tree[0]]) return r
  }

  return false
}

const run = pipe(tryCatch(walk, p => points[p]))

expect(run(`{([(<{}[<>[]}>{[]{[(<()>`)).toEqual(1197, "sample ok")
expect(run(`[[<[([]))<([[{}[[()]]]`)).toEqual(3, "sample ok")
expect(run(`{()}`)).toEqual(false, "sample ok")

aoc
  .readFile("./10.sample")
  .then(parseFile)
  .then(
    pipe(
      map(run),
      reject(isNil),
      sum,
      tap(aoc.expectEqual(26397, "Part A, sample: ok"))
    )
  )

aoc
  .readFile("./10.input")
  .then(parseFile)
  .then(
    pipe(
      map(run),
      reject(isNil),
      sum,
      tap(log("Part A, result:")),
      tap(aoc.expectEqual(392139, "Part A, result: ok"))
    )
  )
