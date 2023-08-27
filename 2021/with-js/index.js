import { execSync } from "child_process";
import { cond, filter, forEach, identity, pipe, repeat, T, test } from "ramda";
import { readdir } from "fs/promises";

const [_cmd, _path, ...args] = process.argv;

const BAR = repeat("=", 20).join("");
const NL = "\n";
const header = t => NL + NL + BAR + NL + `>>> ${t}` + NL + BAR + NL;
const label = t => `>> Duration for ${t}`;
const run = file => {
  console.log(header(`RUNNING ${file}`));
  console.time(label(file));

  let stdio = [];

  try {
    stdio.push(execSync(`node ${file}`, {
      encoding: "utf-8",
      stdio
    }))
  } catch (err) {
    stdio.push(err)
  }

  console.log(stdio.join("\n"))

  console.timeEnd(label(file));
};

const onlyDayFiles = filter(test(/\d\d\.js$/i));
const onlySpecificDay = pipe(RegExp, test, filter);
const filterByArgs = cond([
  [([day]) => day === undefined, () => identity],
  [T, onlySpecificDay],
]);

readdir("./").then(pipe(onlyDayFiles, filterByArgs(args), forEach(run)));
