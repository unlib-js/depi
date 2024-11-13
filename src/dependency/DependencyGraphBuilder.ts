import type DiGraph from '@/graph/DiGraph'
import defaultDepsOf from './depsOf'

export interface DependencyGraphBuilderOptions<T = unknown> {
  /**
   * An optional function that determines the dependencies of a given instance
   * of type `T`.
   *
   * This function is used by the `DependencyGraphBuilder` to construct the
   * dependency graph.
   *
   * If not provided, the `depsOf` function will be used.
   */
  depsOf?: typeof defaultDepsOf<T>
}

export default abstract class DependencyGraphBuilder<T = unknown> {
  protected readonly depsOf: typeof defaultDepsOf<T>
  public constructor({
    depsOf = defaultDepsOf,
  }: DependencyGraphBuilderOptions<T> = {}) {
    this.depsOf = depsOf
  }

  /**
   * Constructs a directed graph (`DiGraph`) from the provided set of
   * instances.
   *
   * The graph will represent the dependencies between the instances, as
   * determined by the `depsOf` function provided in the constructor.
   *
   * @param instances - The set of instances to build the dependency graph
   * from.
   * @returns A directed graph (DiGraph) representing the dependencies between
   * the instances.
   */
  public abstract fromInstances(instances: Set<T>): DiGraph<T>
}
