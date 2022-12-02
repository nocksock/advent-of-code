import { readFile } from "fs/promises";
import { pipe, split, map, juxt, trim } from "ramda";

type Round = ["A" | "B" | "C", "X" | "Y" | "Z"];

readFile("./02.input", "utf-8")
  .then(pipe(trim, split("\n"), map(split(" "))))
  .then(
    juxt([
      (rounds) => {
        const scoremap = {
          A: {
            X: 1 + 3,
            Y: 2 + 6,
            Z: 3,
          },
          B: {
            X: 1,
            Y: 2 + 3,
            Z: 3 + 6,
          },
          C: {
            X: 1 + 6,
            Y: 2,
            Z: 3 + 3,
          },
        };

        console.log(
          "a",
          (rounds as Round[]).reduce(
            (score, [opp, elf]) => score + scoremap[opp][elf],
            0
          )
        );
      },

      (rounds) => {
        const r = 1,
          p = 2,
          s = 3;
        const scoremap = {
          A: {
            X: s + 0,
            Y: r + 3,
            Z: p + 6,
          },
          B: {
            X: r + 0,
            Y: p + 3,
            Z: s + 6,
          },
          C: {
            X: p + 0,
            Y: s + 3,
            Z: r + 6,
          },
        };

        console.log("b", (rounds as Round[]).reduce(
          (score, [opp, elf]) => score + scoremap[opp][elf],
          0
        ));
      },
    ])
  );
