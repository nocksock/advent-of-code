import { readFile } from "fs/promises";
import { add, gt } from "ramda";

const input = await readFile("../07.input", "utf8").then((f) => f.split("\n"));

const dirSizes = input.reduce(
  ({ fs, cwd }, line) => {
    if (["$ ls", "dir"].some((v) => line.startsWith(v))) return { fs, cwd };

    if (line.startsWith("$ cd")) {
      const arg = /\$ cd (.*)/.exec(line)![1];
      if (arg === "/") return { fs, cwd: [] };
      return { fs, cwd: arg === ".." ? cwd.slice(0, -1) : [...cwd, arg] };
    }

    const size = Number(line.split(" ")[0]);

    let paths = [...cwd];
    do {
      const curr = paths.join("/") || "/";
      fs[curr] = fs[curr] ? fs[curr] + size : size;
    } while (paths.pop());

    return { fs, cwd };
  },
  { fs: {} as Record<string, number>, cwd: [] as string[] }
).fs;

const sizes = Object.values(dirSizes);

console.log("A:", sizes.filter(gt(100000)).reduce(add));

// part B
const needed = 30000000;
const max = 70000000;
const unused = max - dirSizes?.["/"];

console.log(
  "B:",
  sizes.reduce(
    (smallest, curr) =>
      unused + curr > needed && smallest > curr ? curr : smallest,
    Infinity
  )
);
