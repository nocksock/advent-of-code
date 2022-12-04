import { readFile } from "fs/promises";
import { pipe, trim, split, map, splitAt, intersection, flatten, sum, juxt, splitEvery, reduce, } from "ramda";

const priorityOf = (c: string) =>
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) + 1;

const getIntersection = (list: string[]) =>
  reduce(
    (acc: string[], cv: string) => intersection(acc, cv.split("")),
    list[0].split(""),
    list
  );

readFile("./03.input", "utf-8")
  .then(pipe(trim, split("\n")))
  .then(
    juxt([
      pipe(
        map((rucksack) => splitAt(rucksack.length / 2, rucksack)),
        map(getIntersection),
        flatten,
        map(priorityOf),
        sum,
        (result) => console.log("a", result)
      ),

      pipe(
        splitEvery(3),
        map(getIntersection),
        flatten,
        map(priorityOf),
        sum,
        (result) => console.log("b", result)
      ),
    ])
  );
