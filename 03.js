import {
  converge,
  countValues,
  equals, expect, filter, get, getKeysBy, getMaxKeys,
  getMinKeys, id, map, multiply, parseBinary, pipe, readFile, removeEmpty, splitChars, splitLines, tapLog, toBinary, transpose
} from "./helpers.js";
const DAY = "03";

const sample = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

const linesToCleanArray = pipe(splitLines, removeEmpty)

// -- PART 1----------------------------------------------------------------
const calcPowerConsumption = pipe(
  linesToCleanArray,
  map(splitChars),
  transpose,
  map(countValues),
  converge(multiply, [pipe(getMaxKeys, toBinary), pipe(getMinKeys, toBinary)])
);

readFile("./03.input")
  .then(pipe(calcPowerConsumption, tapLog(`Day ${DAY}, Part 1:`)));

// -- PART 2----------------------------------------------------------------
const findBit = queryFn => pos => pipe(map(splitChars), transpose, map(countValues), queryFn, get(pos));
const mostCommonBit = findBit(getKeysBy(f => ([a, b]) => f(a) <= f(b) ? b : a))
const leastCommonBit = findBit(getKeysBy(f => ([a, b]) => f(a) > f(b) ? b : a))
const getRatingBy = ratingFn => function recurse(array, pos = 0) {
  const createPredicate = pipe(ratingFn(pos), equals)
  return array.length === 1 
    ? array[0] 
    : recurse(
        converge(
          (predicate, arr) => filter(pipe(get(pos), predicate), arr),
          [createPredicate, id],
          array
        ),
        pos + 1
      )
}

const getOxygenRating = 
  pipe(
    linesToCleanArray,
    getRatingBy(mostCommonBit),
    parseBinary
  )

const getScrubberRating = 
  pipe(
    linesToCleanArray,
    getRatingBy(leastCommonBit),
    parseBinary
  )

readFile("./03.input")
  .then(
    converge(pipe(multiply, tapLog("Day 03, Part 2: ")), [
      getOxygenRating,
      getScrubberRating
    ]))

// -- TESTS ----------------------------------------------------------------
expect(calcPowerConsumption(sample))
  .toEqual( 198, `Day ${DAY}, Part 1: sample verification`);
expect(mostCommonBit(0)(splitLines(sample)))
  .toEqual('1', 'testing getMostBit(0)')
expect(leastCommonBit(0)(splitLines(sample)))
  .toEqual('0', 'testing leastCommonBit(0)')
expect(getOxygenRating(sample))
  .toEqual(23, `Day ${DAY}, Part 2: Sample verification, oxygen`);
expect(getScrubberRating(sample))
  .toEqual( 10, `Day ${DAY}, Part 2: Sample verification, scrubber`);

