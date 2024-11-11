import { describe, expect, it, vi } from 'vitest'
import { SimpleDiGraph } from './DiGraph'
import dfs from './dfs'

describe.concurrent('dfs', () => {
  it('should traverse a tree correctly', () => {
    /*
    Copilot magic:

          A
         / \
        B   C
       / \   \
      D   E   F
     / \     / \
    G   H   I   J
    */
    const edges = new Map<string, Set<string>>([
      ['A', new Set(['B', 'C'])],
      ['B', new Set(['D', 'E'])],
      ['C', new Set(['F'])],
      ['D', new Set(['G', 'H'])],
      ['E', new Set()],
      ['F', new Set(['I', 'J'])],
      ['G', new Set()],
      ['H', new Set()],
      ['I', new Set()],
      ['J', new Set()],
      ['X', new Set(['Y'])], // Another tree
    ])
    const graph = new SimpleDiGraph(edges)
    const visited = new Set<string>()
    const result: string[] = []
    const onLoop = vi.fn()
    dfs(graph, 'A', visited, node => result.push(node), onLoop)
    expect(result)
      .toEqual(['G', 'H', 'D', 'E', 'B', 'I', 'J', 'F', 'C', 'A'])
    expect(onLoop).not.toBeCalled()
  })

  it('should traverse a graph correctly', () => {
    /*
    Graph direction: top-down

      A
     / \
    B   C
     \ / \
      D   E
     / \ / \
    F   G   H
    */
    const edges = new Map<string, Set<string>>([
      ['A', new Set(['B', 'C'])],
      ['B', new Set(['D'])],
      ['C', new Set(['D', 'E'])],
      ['D', new Set(['F', 'G'])],
      ['E', new Set(['G', 'H'])],
      ['F', new Set()],
      ['G', new Set()],
      ['H', new Set()],
    ])
    const graph = new SimpleDiGraph(edges)
    const visited = new Set<string>()
    const result: string[] = []
    const onLoop = vi.fn()
    dfs(graph, 'A', visited, node => result.push(node), onLoop)
    expect(result)
      .toEqual(['F', 'G', 'D', 'B', 'H', 'E', 'C', 'A'])
    expect(onLoop).not.toBeCalled()
  })

  it('should traverse a graph with loop(s) correctly', () => {
    // A <--> B
    const edges = new Map<string, Set<string>>([
      ['A', new Set(['B'])],
      ['B', new Set(['A'])],
    ])
    const graph = new SimpleDiGraph(edges)
    const visited = new Set<string>()
    const result: string[] = []
    const onLoop = vi.fn()
    dfs(graph, 'A', visited, node => result.push(node), onLoop)
    expect(result).toEqual(['B', 'A'])
    expect(onLoop).toBeCalledTimes(1)
    expect([...onLoop.mock.calls[0][0]]).toEqual(['A', 'B', 'A'])
  })

  it('should traverse a graph with loop(s) correctly', () => {
    // A -> B -> C -> A
    const edges = new Map<string, Set<string>>([
      ['A', new Set(['B'])],
      ['B', new Set(['C'])],
      ['C', new Set(['A'])],
    ])
    const graph = new SimpleDiGraph(edges)
    const visited = new Set<string>()
    const result: string[] = []
    const onLoop = vi.fn()
    dfs(graph, 'A', visited, node => result.push(node), onLoop)
    expect(result).toEqual(['C', 'B', 'A'])
    expect(onLoop).toBeCalledTimes(1)
    expect([...onLoop.mock.calls[0][0]]).toEqual(['A', 'B', 'C', 'A'])
  })

  it('should traverse a graph with loop(s) correctly', () => {
    // Fully connected graph
    const edges = new Map<string, Set<string>>([
      ['A', new Set(['B', 'C', 'D'])],
      ['B', new Set(['A', 'C', 'D'])],
      ['C', new Set(['A', 'B', 'D'])],
      ['D', new Set(['A', 'B', 'C'])],
    ])
    const graph = new SimpleDiGraph(edges)
    const visited = new Set<string>()
    const result: string[] = []
    const onLoop = vi.fn()
    dfs(graph, 'A', visited, node => result.push(node), onLoop)
    expect(result).toEqual(['D', 'C', 'B', 'A'])
    const loops = onLoop.mock.calls.map(([stack]) => stack)
    expect(onLoop).toHaveBeenCalledTimes(6)
    expect(loops).toContainEqual(['A', 'B', 'A'])
    expect(loops).toContainEqual(['A', 'B', 'C', 'A'])
    expect(loops).toContainEqual(['A', 'B', 'C', 'B'])
    expect(loops).toContainEqual(['A', 'B', 'C', 'D', 'A'])
    expect(loops).toContainEqual(['A', 'B', 'C', 'D', 'B'])
    expect(loops).toContainEqual(['A', 'B', 'C', 'D', 'C'])
  })
})
