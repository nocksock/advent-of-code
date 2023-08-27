import { expectEqual, injectRamda, readFile, tapLog } from "./helpers.js";

injectRamda();

const isSimpleNum = num => [1, 4, 7, 8].includes(num);
const toLines = split("\n");
const toSides = split(" | ");
const sortDigits = pipe(split(""), digits => digits.sort(), join(""));
const sidesToDigits = map(pipe(split(" "), map(sortDigits)));
const hasAll = arr => subs => subs.every(sub => arr.includes(sub));
const toEntry = num => segments => ({ [segments]: num, [num]: segments });

const entriesFromLength = cond([
  [propEq("length", 2), toEntry(1)],
  [propEq("length", 4), toEntry(4)],
  [propEq("length", 3), toEntry(7)],
  [propEq("length", 7), toEntry(8)],
]);

const entriesToLookup = entries => {
  const dict = mergeAll(entries);
  const bd = difference(dict["4"], dict["7"]);
  const acefg = without(bd, dict["8"]);
  const eg = without(dict["7"], acefg);

  return digits => {
    const has = hasAll(digits);

    if (digits.length === 5) { // 2 3 5
      if (has(bd)) { return 5; }
      if (has(eg)) { return 2; }
      return 3;
    }

    if (digits.length === 6) { // 6 0 9
      if (!has(eg)) { return 9; }
      if ( has(bd)) { return 6; }
      return 0;
    }

    return dict[digits]; // simple numbers
  };
};

const lineToLookup = pipe(nth(0), map(entriesFromLength), entriesToLookup);

const parseFile = pipe(
  trim,
  toLines,
  map(
    pipe(
      toSides,
      sidesToDigits,
      converge(
        (lookupFn, digits) => digits.map(lookupFn),
        [lineToLookup, pipe(nth(1))]
      )
    )
  )
);

const partA = pipe(flatten, filter(isSimpleNum), length);
const partB = pipe(map(pipe(join(""), Number)), sum);

readFile("08.sample")
  .then(parseFile)
  .then(
    juxt([
      pipe(partA, expectEqual(26, "Part A: Sample ok")),
      pipe(partB, expectEqual(61229, "Part B: Sample ok")),
    ])
  );

readFile("08.input")
  .then(parseFile)
  .then(
    juxt([
      pipe(
        partA,
        tapLog("Part A, result"),
        tap(expectEqual(525, "Part A, result still ok"))
      ),
      pipe(
        partB,
        tapLog("Part B, result"),
        tap(expectEqual(1083859, "Part A, result still ok"))
      ),
    ])
  );
