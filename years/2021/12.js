import * as aoc from "./helpers.js"
import t from "tap"
aoc.setup()

const makeNodes = arr =>
  arr.reduce((nodes, [a, b]) => {
    if (!nodes[a]) {
      nodes[a] = []
    }
    if (!nodes[b]) {
      nodes[b] = []
    }

    nodes[a].push(b)
    nodes[b].push(a)

    return nodes
  }, {})

const walk = (node, nodes, visited = {}, foundPaths = []) => {
  let paths = 0

  if (!visited[node]) visited[node] = 0
  visited[node]++

  if (test(/[a-z]+/, node) && visited[node] > 1) {
    return paths
  }

  nodes[node].forEach(path => {
    if (path === "end") paths += 1
    else paths += walk(path, nodes, { ...visited })
  })

  return paths
}

const isSmol = test(/[a-z]+/)
const visitedSmallTwice = visited =>
  Object.values(visited).filter(t => t > 1).length >= 1

const walk_b = (node, nodes, visited = {}, hadSmol = false) => {
  let paths = 0

  if (!visited[node]) visited[node] = 0
  visited[node]++

  if (isSmol(node) && visited[node] > 1 && hadSmol) {
    return paths
  }

  nodes[node].forEach(nextNode => {
    if (nextNode === "end") paths += 1
    else
      paths += walk_b(
        nextNode,
        nodes,
        { ...visited },
        isSmol(node) && visitedSmallTwice(visited)
      )
  })

  return paths
}

const parseInput = pipe(split("\n"), map(split("-")), makeNodes)

readFile("./12.sample")
  .then(parseInput)
  .then(
    juxt([
      pipe(
        nodes => walk("start", nodes),
        expectEqual(226, "Part A, sample: ok")
      ),
      pipe(
        nodes => walk_b("start", nodes),
        expectEqual(3509, "Part B, sample: ok")
      ),
    ])
  )

readFile("./12.input")
  .then(parseInput)
  .then(
    juxt([
      pipe(
        nodes => walk("start", nodes),
        result => console.log("Part A, result:", result)
      ),
      pipe(
        nodes => walk("start", nodes),
        expectEqual(4241, "Part A, result: ok.")
      ),
    ])
  )
