import {converge, every, expect, filter, flatten, get, isTrue, map, multiply, or, pipe, readFile, reject, removeEmpty, some, split, sum, T, tapLog, toNumber, transpose, trim, until} from "./helpers.js";
console.log("\n\n-- DAY 04--")

const parseInput = pipe(trim, split("\n\n"), ([numberInputs, ...boardInputs]) => ({
    numbers: numberInputs.split(",").map(toNumber),
    boards: boardInputs.map(pipe( split("\n"), map( pipe(split(" "), removeEmpty, map(toNumber)))))
})) 
const checkRows = pipe(map(every(isTrue)), some(isTrue))
const checkCols = pipe(transpose, checkRows)
const checkBoard = converge(or, [pipe(transpose,checkRows), checkRows])
const markBoards = (number, boards) => boards.map(map(map(n => n === number ? true : n)))

const drawUntilWinner = ({numbers, boards}) => until(
  round => round.winner?.length > 0,
  ({numbers,boards}) => {
    const markedBoards = markBoards(numbers[0], boards)
    return {
      numbers: numbers.slice(1),
      number: numbers[0],
      boards: reject(checkBoard, markedBoards),
      winner: filter(checkBoard, markedBoards)
    };
  },
  { numbers, boards }
)

const calculateScore = converge(multiply,
  [pipe(get('winner'), flatten, reject(isTrue), sum), get('number')]
);

// -- PART A----------------------------------------------------------------
readFile("./04.sample")
  .then(pipe(
    parseInput,
    drawUntilWinner,
    calculateScore,
    result => expect(result).toEqual(4512, "Day 04, Part A: Sample ok")
  ))

readFile("./04.input")
  .then(pipe(
    parseInput,
    drawUntilWinner,
    calculateScore,
    result => console.log("Day 04, Part A: ", result)
  ))

// -- PART B ---------------------------------------------------------------
readFile("./04.sample")
  .then(pipe(
    parseInput,
    until(
      round => round.boards.length === 1,
      drawUntilWinner,
    ),
    drawUntilWinner,
    calculateScore,
    result => expect(result).toEqual(1924, "Day 04, Part B: Sample ok")
  ))

readFile("./04.input")
  .then(pipe(
    parseInput,
    until(
      round => round.boards.length === 1,
      drawUntilWinner,
    ),
    drawUntilWinner,
    calculateScore,
    result => console.log("Day 04, Part B: ", result)
  ))

//
// -- TESTS ----------------------------------------------------------------
//
expect(checkRows([ 
  [1, 2, 3], 
  [true, true, true] ,
  [7, 8, 9]
]))
  .toEqual(true, 'Verify that checkRow for true works')

expect(checkRows([ 
  [1, 2, 3], 
  [4, 5, 6] ,
  [7, 8, 9]
]))
  .toEqual(false, 'Verify that checkRow for false works')

expect(checkCols([ 
  [true, 2, 3], 
  [true, 5, 6] ,
  [true, 8, 9]
]))
  .toEqual(true, 'Verify that checkCols for true works')

expect(checkCols([ 
  [1, 2, 3], 
  [4, 5, 6] ,
  [7, 8, 9]
]))
  .toEqual(false, 'Verify that checkCols for false works')

expect(checkBoard([ 
  [1, T, T], 
  [T, T, T] ,
  [7, T, 9]
]))
  .toEqual(true, 'Verify that checkBoard true works')

expect(checkBoard([ 
  [1, T, T], 
  [T, 5, T] ,
  [T, T, 9]
]))
  .toEqual(false, 'Verify that checkBoard false works')
