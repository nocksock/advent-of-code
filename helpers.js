// qnd FP helpers
export const pipe = (...fns) => initialValue => fns.reduce((p, f) => f(p), initialValue);
export const map = fn => functor => functor.map(fn)

// utils
export const sum = arr => arr.reduce((sum, cv) => sum + cv, 0)
export const inToArr = input => input.split("\n").map(i => parseInt(i, 10))

