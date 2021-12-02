import { fromFile,expect, apply, tapLog, split, map, pipe, test, filterEmpty, multiply } from "./helpers.js";

// -- PART 1 ---------------------------------------------------------------
const sample = `forward 5
down 5
forward 8
up 3
down 8
forward 2
`;

const parseCommands = commands => commands.reduce(([x, y], [cmd, value]) => {
  switch(cmd) {
    case 'forward': return [x + Number(value), y]
    case 'up': return [x, y - Number(value)]
    case 'down': return [x, y + Number(value)]
  }
}, [0, 0])
 
const parseInput = pipe(
  split('\n'),
  filterEmpty,
  map(split(' ')),
  parseCommands,
);

expect(parseInput(sample)).toEqual([15, 10], 'Day 02, Part 1: Sample is ok')

const parseFile = fromFile(
  pipe(
    parseInput,
    apply(multiply), tapLog("Day 02, Part A:")
  ))

parseFile("./02.input")

// -- PART TWO--------------------------------------------------------------
const parseCommandsWithAim = commands => commands.reduce(([x, y, aim], [cmd, units]) => {
  switch(cmd) {
    case 'down': return [x, y, aim + units]
    case 'up': return [x, y, aim - units]
    case 'forward': return [x + units, y + (aim * units), aim]
  }
}, [0, 0, 0])

const parseInputPartB = pipe(
  split('\n'),
  filterEmpty,
  map(split(' ')),
  map(([cmd, value]) => [cmd, Number(value)]),
  parseCommandsWithAim,
  apply(multiply),
)

const partB = fromFile(pipe(
  parseInputPartB,
  tapLog("Day 02, Part B:")
))

expect(parseInputPartB(sample)).toEqual(900, 'Day 02, Part 2: Sample is ok')

partB("./02.input")

