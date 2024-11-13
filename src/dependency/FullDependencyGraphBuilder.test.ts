import { describe, expect, it, vi } from 'vitest'
import FullDependencyGraphBuilder from './FullDependencyGraphBuilder'
import type DiGraph from '@/graph/DiGraph'
import { SimpleDiGraph } from '@/graph/DiGraph'

describe('FullDependencyGraphBuilder', () => {
  it('should work with no instance', () => {
    const builder = new FullDependencyGraphBuilder()
    const graph = builder.fromInstances(new Set())
    expect(new Set(graph.nodes())).toEqual(new Set())
  })

  it('should work with single instance', () => {
    const builder = new FullDependencyGraphBuilder({
      depsOf: () => ({}),
    })
    const graph = builder.fromInstances(new Set(['A']))
    expect(new Set(graph.nodes())).toEqual(new Set('A'))
  })

  it('should work with isolated instances', () => {
    const builder = new FullDependencyGraphBuilder({
      depsOf: () => ({}),
    })
    const graph = builder.fromInstances(new Set(['A', 'B', 'C']))
    expect(new Set(graph.nodes())).toEqual(new Set(['A', 'B', 'C']))
  })

  function checkConsistency<T>(graph: DiGraph<T>, nodes: T[]) {
    const gotNodes = new Set(graph.nodes())
    expect(gotNodes).toEqual(new Set(nodes))
    for (const [src, children] of graph.entries()) {
      expect(gotNodes).toContain(src)
      children.forEach(dst => expect(gotNodes).toContain(dst))
    }
  }

  const depsOf = () => ({
    props: [{ value: 'X', prop: 'x' }],
    params: [{ value: 'Y', param: 0 }],
  })

  it('should return a consistent DiGraph', () => {
    const builder = new FullDependencyGraphBuilder({
      depsOf,
      onUnlistedInstance: () => false,
    })
    const graph = builder.fromInstances(new Set(['A', 'B', 'C']))
    checkConsistency(graph, ['A', 'B', 'C'])
  })

  it('should return a consistent DiGraph', () => {
    const builder = new FullDependencyGraphBuilder({
      depsOf,
      onUnlistedInstance: () => true,
    })
    const graph = builder.fromInstances(new Set(['A', 'B', 'C']))
    checkConsistency(graph, ['A', 'B', 'C', 'X', 'Y'])
  })

  function mkDeps(children: string[]) {
    return {
      props: children.map(node => ({ value: node, prop: node })),
      params: [],
    }
  }

  function checkGraphEqual<T>(got: DiGraph<T>, expected: DiGraph<T>) {
    expect(new Set(got.nodes())).toEqual(new Set(expected.nodes()))
    for (const [node, children] of expected.entries()) {
      expect(got.childrenOf(node)).toEqual(children)
    }
  }

  it('should handle circular dependency', () => {
    const truthGraph = new SimpleDiGraph(new Map([
      ['A', new Set(['B'])],
      ['B', new Set(['C'])],
      ['C', new Set(['D'])],
      ['D', new Set(['A'])],
    ]))
    const builder = new FullDependencyGraphBuilder<string>({
      depsOf: inst => mkDeps([...truthGraph.childrenOf(inst)]),
    })
    const nodes = ['A', 'B', 'C', 'D']
    const graph = builder.fromInstances(new Set(nodes))
    checkConsistency(graph, nodes)
    checkGraphEqual(graph, truthGraph)
  })

  it('should handle circular dependency', () => {
    const truthGraph = new SimpleDiGraph<string>(new Map([
      ['A', new Set(['B'])],
      ['B', new Set(['C'])],
      ['C', new Set(['A', 'D'])],
      ['D', new Set()],
    ]))
    const builder = new FullDependencyGraphBuilder<string>({
      depsOf: inst => mkDeps([...truthGraph.childrenOf(inst)]),
    })
    const nodes = ['A', 'B', 'C', 'D']
    const graph = builder.fromInstances(new Set(nodes))
    checkConsistency(graph, nodes)
    checkGraphEqual(graph, truthGraph)
  })

  it('should handle unlisted instance correctly', () => {
    const truthGraph = new SimpleDiGraph<string>(new Map([
      ['A', new Set(['B'])],
      ['B', new Set(['C'])],
      ['C', new Set(['A', 'D'])],
      ['D', new Set(['X'])],
      ['X', new Set(['Y', 'Z'])],
      ['Z', new Set(['Y', 'Z'])],
    ]))
    const initNodes = new Set(['A', 'B', 'C', 'D'])
    const onUnlistedInstance = vi.fn(inst => inst === 'Z')
    const builder = new FullDependencyGraphBuilder<string>({
      depsOf: inst => mkDeps([...truthGraph.childrenOf(inst)]),
      onUnlistedInstance,
    })
    const graph0 = builder.fromInstances(initNodes)
    checkConsistency(graph0, ['A', 'B', 'C', 'D'])
    checkGraphEqual(graph0, new SimpleDiGraph(new Map([
      ['A', new Set(['B'])],
      ['B', new Set(['C'])],
      ['C', new Set(['A', 'D'])],
      ['D', new Set()],
    ])))
    expect(onUnlistedInstance.mock.calls.map(args => args[0])).toEqual(['X'])

    onUnlistedInstance.mockReset().mockImplementation(inst => inst === 'X')
    const graph1 = builder.fromInstances(initNodes)
    checkConsistency(graph1, ['A', 'B', 'C', 'D', 'X'])
    checkGraphEqual(graph1, new SimpleDiGraph(new Map([
      ['A', new Set(['B'])],
      ['B', new Set(['C'])],
      ['C', new Set(['A', 'D'])],
      ['D', new Set(['X'])],
      ['X', new Set()],
    ])))
    expect(new Set(onUnlistedInstance.mock.calls.map(args => args[0])))
      .toEqual(new Set(['X', 'Y', 'Z']))

    onUnlistedInstance.mockReset()
      .mockImplementation(inst => inst === 'X' || inst === 'Z')
    const graph2 = builder.fromInstances(initNodes)
    checkConsistency(graph2, ['A', 'B', 'C', 'D', 'X', 'Z'])
    checkGraphEqual(graph2, new SimpleDiGraph(new Map([
      ['A', new Set(['B'])],
      ['B', new Set(['C'])],
      ['C', new Set(['A', 'D'])],
      ['D', new Set(['X'])],
      ['X', new Set(['Z'])],
      ['Z', new Set(['Z'])],
    ])))
  })
})
