import { readFile } from "fs/promises";
import { juxt } from "ramda";

const isMarker = (group: string[]) => new Set(group).size === group.length;

const findMarkerIndex = (groupSize: number) => (input: string) =>
  input
    .split("")
    .findIndex((_char, cursor, stack) =>
      isMarker(stack.slice(cursor, cursor + groupSize))
    ) + groupSize;

readFile("../06.input", "utf-8")
  .then(juxt([findMarkerIndex(4), findMarkerIndex(14)]))
  .then(console.log);
