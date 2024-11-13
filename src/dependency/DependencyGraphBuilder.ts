import type DiGraph from '@/graph/DiGraph'
import defaultDepsOf from './depsOf'

export interface DependencyGraphBuilderOptions<T = unknown> {
  depsOf?: typeof defaultDepsOf<T>
}

export default abstract class DependencyGraphBuilder<T = unknown> {
  protected readonly depsOf: typeof defaultDepsOf<T>
  public constructor({
    depsOf = defaultDepsOf,
  }: DependencyGraphBuilderOptions<T> = {}) {
    this.depsOf = depsOf
  }

  public abstract fromInstances(instances: Set<T>): DiGraph<T>
}
