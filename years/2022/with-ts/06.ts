import { readFile } from "fs/promises";
import { juxt, split } from "ramda";

const isMarker = (group: string[]) => new Set(group).size === group.length;

const findMarkerIndex = (size: number) => (input: string[]) =>
  input.findIndex((_, c, s) => isMarker(s.slice(c, c + size))) + size;

readFile("../06.input", "utf-8")
  .then(split(""))
  .then(juxt([findMarkerIndex(4), findMarkerIndex(14)]))
  .then(console.log);
