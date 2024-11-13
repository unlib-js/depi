import type DependencyGraphBuilder from './dependency/DependencyGraphBuilder'
import FullDependencyGraphBuilder from './dependency/FullDependencyGraphBuilder'
import dfs from './graph/dfs'
import DiGraph, { SimpleDiGraph } from './graph/DiGraph'

export interface DestroyAllOptions<T = unknown> {
  /**
   * The instances to be destroyed.
   */
  instances: T[] | Set<T>
  /**
   * An optional callback that is called when a circular dependency is
   * detected.
   *
   * The callback receives the stack of instances involved in the circular
   * dependency, and the full dependency graph.
   *
   * NOTE: This callback is called during the traverse-and-destroy process.
   * Therefore, it could be called multiple times when the destruction of some
   * instances may have already been started.
   *
   * @param stack - The stack of instances involved in the circular dependency.
   * @param graph - The full dependant graph.
   */
  onCircularDependencyDetected?: (
    stack: T[],
    graph: DiGraph<T>,
  ) => void
  /**
   * An optional dependency graph builder function or instance that can be used
   * to construct the dependency graph for the instances being destroyed. If
   * not provided, a default `FullDependencyGraphBuilder` will be used.
   */
  dependencyGraphOf?:
    | DependencyGraphBuilder<T>
    | ((instances: Set<T>) => DiGraph<T>)
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
export default async function destroy<T = unknown>({
  instances,
  onCircularDependencyDetected: onLoop,
  dependencyGraphOf = new FullDependencyGraphBuilder<T>(),
}: DestroyAllOptions<T>) {
  instances = new Set(instances)
  // B -> A: B depends on A
  const dependencyGraph = typeof dependencyGraphOf === 'function'
    ? dependencyGraphOf(instances)
    : dependencyGraphOf.fromInstances(instances)
  // A -> B: A is the dependency of B
  const dependantGraph = SimpleDiGraph.fromReversed(dependencyGraph)
  let minDeps = Infinity
  // The nodes with the least dependencies (ideally, 0)
  let minDepsNodes: T[] = []
  for (const [node, children] of dependencyGraph.entries()) {
    if (children.size < minDeps) {
      minDeps = children.size
      minDepsNodes = [node]
    } else if (children.size === minDeps) {
      minDepsNodes.push(node)
    }
  }
  // Instance -> the disposal promise of the instance
  const tasks = new Map<T, Promise<void>>()
  const visited = new Set<T>()
  async function destroy(inst: T) {
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

async function waitForDependantsToBeDestroyed<T = unknown>(
  dependantGraph: DiGraph<T>,
  node: T,
  destructionTasks: Map<T, Promise<void>>,
) {
  const dependants = [...dependantGraph.childrenOf(node)]
  await Promise.all(dependants.map(async dependant =>
    destructionTasks.get(dependant)))
}
