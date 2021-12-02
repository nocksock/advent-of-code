import { readFile } from "fs";

// qnd FP helpers
export const pipe = (...fns) => initialValue => fns.reduce((p, f) => f(p), initialValue);
export const list = (...args) => args
export const map = fn => functor => functor.map(fn)
export const apply = fn => args => fn.apply(this, args)
export const filter = predicate => arr => arr.filter(predicate)
export const multiply = (a, b) => a * b

// utils
export const tap = fn => arg => {  fn(arg); return arg }
export const split = delim => string => string.split(delim)
export const tapLog = (message = "") => tap(console.log.bind(console, message))
export const toJson = n => JSON.stringify(n)
export const deepEquals = (a, b) => toJson(a) === toJson(b)
export const sum = arr => arr.reduce((sum, cv) => sum + cv, 0)
export const filterEmpty = filter(s => s.length !== 0)
export const fromFile = cb => filename => readFile(filename, "utf8", (err, data) => {
  if (err) throw err;
  cb(data);
})


// testing
export const test = (condition, err, ok) => {
  if (condition) {
    console.log(ok)
  } 

  if (!condition) {
    console.error('TEST FAILED: ', err)
  }
}

export const expect = result => ({
  toEqual: (expectation, message) => 
    test(
      deepEquals(result, expectation),
      `FAILED: ${message}\n${result} is not Equal to ${expectation}`,
      message
    )
})
