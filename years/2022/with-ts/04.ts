import { readFile } from "fs/promises";
import { pipe, trim, split, map, length, filter, juxt } from "ramda";

type Pair = [Number, Number];

const toMinMax = (input: string) =>
  input.split("-").map(Number) as unknown as Pair;

const contained = ([aMin, aMax]: Pair, [bMin, bMax]: Pair) =>
  aMin <= bMin && aMax >= bMax;

const intersects = ([aMin, aMax]: Pair, [bMin, bMax]: Pair) =>
  (aMax <= bMin && aMax >= bMin) || (aMin >= bMin && aMin <= bMax);

const isWithin = (a: Pair, b: Pair) => contained(a, b) || contained(b, a);

const isOverlapping = (a: Pair, b: Pair) =>
  isWithin(a, b) || intersects(b, a);

readFile("./04.input", "utf8")
  .then(pipe(trim, split("\n")))
  .then(
    pipe(
      map(split(",")),
      juxt([
        map(([left, right]) => isWithin(toMinMax(left), toMinMax(right))),
        map(([left, right]) => isOverlapping(toMinMax(left), toMinMax(right))),
      ]),
      map(pipe(filter(Boolean), length, console.log))
    )
  );
