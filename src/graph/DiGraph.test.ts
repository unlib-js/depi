import { describe, expect, it } from 'vitest'
import { SimpleDiGraph } from './DiGraph'

describe('SimpleDiGraph', () => {
  it('should create an empty graph', () => {
    const graph = new SimpleDiGraph(new Map())
    expect(new Set(graph.nodes())).toEqual(new Set())
  })

  it('should create a graph with initial edges', () => {
    const edges = new Map([
      ['A', new Set(['B', 'C'])],
      ['B', new Set(['C'])],
      ['C', new Set()],
      ['D', new Set('D')],
    ])
    const graph = new SimpleDiGraph(edges)
    expect(new Set(graph.nodes())).toEqual(new Set(['A', 'B', 'C', 'D']))
    expect(graph.childrenOf('A')).toEqual(new Set(['B', 'C']))
    expect(graph.childrenOf('B')).toEqual(new Set(['C']))
    expect(graph.childrenOf('C')).toEqual(new Set())
    expect(graph.childrenOf('D')).toEqual(new Set(['D']))
  })

  it('should handle isolated nodes', () => {
    const edges = new Map([
      ['A', new Set()],
      ['B', new Set()],
      ['C', new Set()],
    ])
    const graph = new SimpleDiGraph(edges)
    expect(new Set(graph.nodes())).toEqual(new Set(['A', 'B', 'C']))
    expect(graph.childrenOf('A')).toEqual(new Set())
    expect(graph.childrenOf('B')).toEqual(new Set())
    expect(graph.childrenOf('C')).toEqual(new Set())
  })

  it('should return correct entries', () => {
    const entries = [
      ['A', new Set(['B', 'C'])],
      ['B', new Set(['C'])],
      ['C', new Set()],
      ['D', new Set('D')],
    ] as const
    const edges = new Map(entries)
    const graph = new SimpleDiGraph(edges)
    expect(new Set(graph.entries())).toEqual(new Set(entries))
  })

  it('should reverse the graph correctly', () => {
    const edges = new Map([
      ['A', new Set(['B', 'C'])],
      ['B', new Set(['C'])],
      ['C', new Set()],
      ['D', new Set('D')],
    ])
    const graph = new SimpleDiGraph(edges)
    const rGraph = SimpleDiGraph.fromReversed(graph)
    expect(new Set(rGraph.nodes())).toEqual(new Set(['A', 'B', 'C', 'D']))
    expect(rGraph.childrenOf('A')).toEqual(new Set())
    expect(rGraph.childrenOf('B')).toEqual(new Set(['A']))
    expect(rGraph.childrenOf('C')).toEqual(new Set(['A', 'B']))
    expect(rGraph.childrenOf('D')).toEqual(new Set(['D']))
  })
})
