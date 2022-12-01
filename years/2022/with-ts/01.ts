import { readFile } from "fs/promises";
import { juxt, last, map, pipe, sort, split, subtract, sum } from "ramda";

readFile("./01.input", "utf-8")
  .then(
    pipe(
      split("\n\n"),
      map(pipe(split("\n"), map(Number), sum)),
      sort(subtract)
    )
  )
  .then(
    juxt([
      // A
      (orderedSums) => {
        console.log("A: largest sum:", last(orderedSums));
      },

      // B
      (orderedSums) => {
        const top3 = orderedSums.slice(-3);
        console.log("B: Top 3 sum:", sum(top3));
      },
    ])
  );
