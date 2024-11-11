import { MetaKey, symbols } from './common'
import dfs from './graph/dfs'
import DiGraph, { SimpleDiGraph } from './graph/DiGraph'
import getMetadata from './helpers/metadata/get'
import type { Dependant } from './types'

export interface DestroyAllOptions {
  /**
   * The instances to be destroyed.
   */
  instances: unknown[]
  /**
   * An optional callback that is called when a circular dependency is
   * detected.
   *
   * The callback receives the stack of instances involved in the circular
   * dependency, and the full dependency graph.
   *
   * @param stack - The stack of instances involved in the circular dependency.
   * @param graph - The full dependency graph.
   */
  onCircularDependencyDetected?: (
    stack: unknown[],
    graph: DiGraph<unknown>,
  ) => void
}

/**
 * Asynchronously destroys a set of instances. Dependencies are destroyed
 * **after** their dependants.
 *
 * This function first constructs a dependant graph for the given instances.
 * It then traverses the graph in post-order. When all child nodes (dependants)
 * are destroyed, it then destroys the parent node (dependency).
 *
 * If there are any remaining instances that have not been destroyed, it
 * assumes they have circular dependencies and destroys them anyway.
 *
 * @param opts - The options for destroying the instances.
 * @returns A promise that resolves when all instances have been destroyed.
 */
export async function destroy({
  instances,
  onCircularDependencyDetected: onLoop,
}: DestroyAllOptions) {
  // A -> B: A is the dependency of B
  const dependantGraph = dependantGraphOf(instances)
  // B -> A: B depends on A
  const dependencyGraph = dependencyGraphOf(instances)
  let minDeps = Infinity
  // The nodes with the least dependencies (ideally, 0)
  let minDepsNodes: unknown[] = []
  for (const [node, children] of dependencyGraph.entries()) {
    if (children.size < minDeps) {
      minDeps = children.size
      minDepsNodes = [node]
    } else if (children.size === minDeps) {
      minDepsNodes.push(node)
    }
  }
  // Instance -> the disposal promise of the instance
  const tasks = new Map<unknown, Promise<void>>()
  const visited = new Set<unknown>()
  async function destroy(inst: unknown) {
    await waitForDependantsToBeDestroyed(
      dependantGraph,
      inst,
      tasks,
    )
    // Destroy the node itself
    if (Symbol.asyncDispose in (inst as object)) {
      await (inst as AsyncDisposable)[Symbol.asyncDispose]()
      return
    }
    (inst as Partial<Disposable>)[Symbol.dispose]?.()
  }
  for (const root of minDepsNodes) {
    dfs(
      dependantGraph,
      root,
      visited,
      inst => tasks.set(inst, destroy(inst)),
      onLoop,
    )
  }
  // If there are any remains, they must contain loop(s)
  for (const inst of instances) {
    if (tasks.has(inst)) continue
    // Destroy the instance anyway
    dfs(
      dependantGraph,
      inst,
      visited,
      inst => tasks.set(inst, destroy(inst)),
    )
  }
  await Promise.all(tasks.values())
}

/**
 * @internal
 */
export function depsOf(inst: unknown) {
  if (!inst) return {}
  const proto = Reflect.getPrototypeOf(inst)
  if (!proto) return {}
  type PropKeys = (string | symbol)[]
  const propKeys = getMetadata<PropKeys>(
    MetaKey.DependsOnProps,
    proto.constructor,
  ) ?? []
  const props = propKeys
    .map(prop => Reflect.get(inst, prop, inst) as unknown)
    .filter(Boolean) // Skip falsy prop values
  const params = (inst as Partial<Dependant>)[symbols.ctorDeps] ?? []
  return { props, params }
}

/**
 * @internal
 */
export function dependencyGraphOf(instances: unknown[]) {
  const cache = new Map<unknown, Set<unknown>>()
  return new DiGraph<unknown>({
    nodes: () => instances.values(),
    childrenOf(node) {
      const cached = cache.get(node)
      if (cached) return cached
      const { props = [], params = [] } = depsOf(node)
      const deps = new Set([...props, ...params])
      cache.set(node, deps)
      return deps
    },
  })
}

/**
 * @internal
 */
export function dependantGraphOf(instances: unknown[]) {
  const dependants = new Map<unknown, Set<unknown>>()
  function addNode(node: unknown) {
    if (dependants.has(node)) return
    dependants.set(node, new Set())
  }
  function addEdge(src: unknown, dst: unknown) {
    const _dependants = dependants.get(src) ?? new Set()
    _dependants.add(dst)
    dependants.set(src, _dependants)
  }
  for (const inst of instances) {
    addNode(inst)
    const { props, params } = depsOf(inst)
    props?.forEach(dep => addEdge(dep, inst))
    params?.forEach(dep => addEdge(dep, inst))
  }
  return new SimpleDiGraph(dependants)
}

async function waitForDependantsToBeDestroyed(
  dependantGraph: DiGraph<unknown>,
  node: unknown,
  destructionTasks: Map<unknown, Promise<void>>,
) {
  const dependants = [...dependantGraph.childrenOf(node)]
  await Promise.all(dependants.map(async dependant =>
    destructionTasks.get(dependant)))
}
