import { readFile } from "fs/promises";
import { concat, pipe, reduce, split, sum, trim } from "ramda";

const sample = readFile("../10.input", "utf8");

const prepare = pipe(trim, split("\n"));

const parseLine = (line: string) => {
  const [cmd, arg] = line.split(" ");
  if (cmd === "noop") {
    return [0];
  }
  if (cmd === "addx") {
    return [0, Number(arg)];
  }
  throw new Error(`unknown cmd ${cmd}`);
};

const parseLines = reduce(
  (values, line: string) => {
    return concat(values, parseLine(line));
  },
  [1]
);

const peek = (cycles: number) => pipe((r) => r.slice(0, cycles), sum);

const values = await sample.then(prepare).then(parseLines);

const lookAt = [20, 60, 100, 140, 180, 220];

console.log(
  "A",
  sum(
    lookAt.map((cycles) => peek(cycles)(values) * cycles, [])
  )
);
