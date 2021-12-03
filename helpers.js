import fs from "fs";

// -- FP utils -------------------------------------------------------------
export const pipe = (...fns) => (...initParams) => initParams.length > 1 
  ? fns.slice(1).reduce((p, f) => f(p), fns[0].apply(this, initParams))
  : fns.reduce((p, f) => f(p), initParams[0]);
export const curry = fn => function curried(...args) {
    return (args.length >= fn.length) 
      ?  fn.apply(this, args)
      : (...args2) => curried.apply(this, args.concat(args2));
    }
export const reduce = curry((fn, initialValue, array) => array.reduce(fn, initialValue))
export const map = fn => functor => functor.map(fn)
export const apply = fn => args => fn.apply(this, args)
export const filter = curry((predicate, arr) => arr.filter(predicate))
export const id = id => id
export const get = p => o => o[p]
export const pluck = p => map(get(p))
export const converge = curry((convergeFn, branchFns, param) => 
  convergeFn.apply(this, branchFns.map(fn => fn(param))))
export const list = (...args) => args
export const transpose = arr => map(col => map(row => row[col])(arr))(Object.keys(arr[0]))
export const K = value => () => value // aka always

// utils
export const max = arr => Math.max.apply(Math, arr)
export const maxBy = f => ([a, b]) => f(b) > f(a) ? b : a
export const minBy = f => ([a, b]) => f(b) < f(a) ? b : a
export const join = glue => arr => arr.join(glue)
export const parseBinary = s => parseInt(s, 2)
export const multiply = (a, b) => a * b
export const tap = fn => (...args) => pipe(fn.apply(fn.context, args), K(args))
export const tapLog = prefix => arg => {
  console.log(prefix, toJson(arg))
  return arg
}
export const inspect = arg => {
  console.log("-- inspect: ", toJson(arg))
  return arg
}
export const split = delim => string => string.split(delim)
export const splitLines = split('\n')
export const splitChars = split('')
export const splitWords = split(' ')
export const toJson = n => JSON.stringify(n)
export const toBinary = pipe(join(""), parseBinary);
export const getKeysBy = fn => pipe(map(Object.entries), map((i) => {
  if (i.length === 1) return i[0]
  return fn (get(1)) (i)
}), pluck(0));
export const getMaxKeys = getKeysBy(maxBy); // something is broken here
export const getMinKeys = getKeysBy(minBy);
export const countValues = arr => arr.reduce((acc, cv) => {
  if (!acc[cv]) acc[cv] = 0;
  acc[cv]++;
  return acc;
}, {})

export const equals = curry((a, b) => a === b);
export const deepEquals = (a, b) => toJson(a) === toJson(b)
export const sum = arr => arr.reduce((sum, cv) => sum + cv, 0)
export const removeEmpty = filter(s => s.length !== 0)
export const fromFile = curry((cb, filename) => 
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) throw err;
      cb(data);
    }))

export const readFile = filename => new Promise((resolve) => 
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) throw err;
    resolve(data);
  })
)

// testing
export const test = (condition, err, ok) => {
  if (condition) {
    console.log(ok)
  } 

  if (!condition) {
    console.error('\x1b[31mFAILED:\x1b[0m', err)
  }
}

export const expect = result => ({
  toEqual: (expectation, message) => 
    test(
      deepEquals(result, expectation),
      `${message}\n\t${toJson(result)} is not Equal to ${toJson(expectation)}\n`,
      message
    )
})
