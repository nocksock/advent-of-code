import { always, times, pipe } from "ramda";

const printFoo = pipe(always("foo"), console.log)

times(printFoo, 4)
