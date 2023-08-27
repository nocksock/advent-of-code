import { readFile } from "fs/promises";
import { performance } from "perf_hooks";
import { juxt, map } from "ramda";
import "./utils";

const { timerify } = performance;

type Instruction = [number, number, number];
type Stack = string[];

const transpose = <T extends any[][]>(arr: T) =>
  arr[0].map((_row, ri) => arr.map((col) => col[ri]));

const parseDrawing = (drawing: string[]) =>
  transpose(
    drawing
      .slice(0, -1)
      .map((line) => line.split(/(....)/).filter((c) => c !== ""))
  )
    .map((l) => l.map((s) => s.trim()).filter(Boolean))
    .map((s) => s.map((c) => c.slice(1, 2))) as Stack[];

const parseInstruction = (input: string) =>
  input
    .split(/move (\d+) from (\d+) to (\d+)/)
    .filter(Boolean)
    .map(Number)
    .map((v, index) => (index === 0 ? v : v - 1)) as Instruction;

const execWith =
  (collect: (count: number, from: number, stacks: Stack[]) => string[]) =>
  ([drawing, instructions]: string[][]) =>
    instructions
      .filter(Boolean)
      .map(parseInstruction)
      .reduce((stacks, [count, from, to]) => {
        stacks[to] = [...collect(count, from, stacks), ...stacks[to]];
        return stacks;
      }, parseDrawing(drawing));

const useCrateMover9000 = execWith((num, from, stck) =>
  stck[from].splice(0, num).reverse()
);

const useCrateMover9001 = execWith((num, from, stck) =>
  stck[from].splice(0, num)
);

const main = () =>
  timerify(function readInput() {
    return readFile("./05.input", "utf-8");
  })()
    .then(function splitInput(f) {
      return f.split("\n\n").map((l) => l.split("\n"));
    })
    .then(juxt([timerify(useCrateMover9000), timerify(useCrateMover9001)]))
    .then(map((stack: string[][]) => stack.map((s) => s[0]).join("")))
    .then(map(console.log));

performance.timerify(main)();
