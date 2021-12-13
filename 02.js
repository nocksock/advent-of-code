import * as aoc from "./helpers.js"
aoc.setup()

// --- IMPLEMENTATIONS ----------------------------------------------------------------------

const parseFile = pipe(
  trim,
  split("\n"),
  map(split(" ")),
  map(([cmd, value]) => [cmd, Number(value)])
)

const parseCommands = commands =>
  commands.reduce(
    ([x, y], [cmd, value]) => {
      switch (cmd) {
        case "forward":
          return [x + value, y]
        case "up":
          return [x, y - value]
        case "down":
          return [x, y + value]
      }
    },
    [0, 0]
  )

const parseCommandsWithAim = commands =>
  commands.reduce(
    ([x, y, aim], [cmd, units]) => {
      switch (cmd) {
        case "down":
          return [x, y, aim + units]
        case "up":
          return [x, y, aim - units]
        case "forward":
          return [x + units, y + aim * units, aim]
      }
    },
    [0, 0, 0]
  )

// --- RUNNING ----------------------------------------------------------------------

readFile("02.sample")
  .then(parseFile)
  .then(
    juxt([
      pipe(
        parseCommands,
        product,
        tap(expectEqual(150, "Part 1, sample: ok"))
      ),
      pipe(
        parseCommandsWithAim,
        slice(0, 2),
        product,
        tap(expectEqual(900, "Part 2, sample: ok"))
      ),
    ])
  )

readFile("02.input")
  .then(parseFile)
  .then(
    juxt([
      pipe(parseCommands, product, tap(log("Part 1, result"))),
      pipe(
        parseCommandsWithAim,
        slice(0, 2),
        product,
        tap(log("Part 2, result:"))
      ),
    ])
  )
