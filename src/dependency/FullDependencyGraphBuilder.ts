import DiGraph, { SimpleDiGraph } from '@/graph/DiGraph'
import DependencyGraphBuilder, {
  type DependencyGraphBuilderOptions,
} from './DependencyGraphBuilder'
import type { UnlistedInstanceContext } from './types'

/**
 * A function that is called when an encountered instance is not in the initial
 * set of instances provided to the `fromInstances` method.
 *
 * This callback allows the caller to decide whether to include the unlisted
 * instance in the dependency graph or not.
 *
 * @param unlistedInst - The unlisted instance that was encountered.
 * @param ctx - Additional context about the unlisted instance, including the
 * current object that depends on `unlistedInst`, the property or constructor
 * parameter that referenced the unlisted instance, and the set of instances
 * that have already been added to the graph.
 * @returns `true` if the unlisted instance should be included in the
 * dependency graph, `false` otherwise.
 */
export type OnUnlistedInstance<T = unknown> =
  (unlistedInst: T, ctx: UnlistedInstanceContext<T>) => boolean

export interface FullDependencyGraphBuilderOptions<T = unknown>
  extends DependencyGraphBuilderOptions<T> {
  /**
   * An optional callback that is called when an encountered instance is not in
   * the initial set of instances provided to the `fromInstances` method.
   *
   * @see OnUnlistedInstance
   */
  onUnlistedInstance?: OnUnlistedInstance<T>
}

export default class FullDependencyGraphBuilder<T = unknown>
  extends DependencyGraphBuilder<T> {
  protected onUnlistedInstance?: OnUnlistedInstance<T>
  public constructor({
    onUnlistedInstance,
    ...opts
  }: FullDependencyGraphBuilderOptions<T> = {}) {
    super(opts)
    this.onUnlistedInstance = onUnlistedInstance
  }

  // Default behavior:
  // Construct the graph consisting of only given instances
  public override fromInstances(instances: Set<T>): DiGraph<T> {
    const { depsOf } = this
    const edges = new Map<T, Set<T>>()

    // Internal context for handling unlisted instances
    const queue = [...instances]
    let inst = queue.shift()
    const ctx = this.onUnlistedInstance
      ? {
        onUnlistedInstance: this.onUnlistedInstance,
        instances: new Set(instances),
        addNode(inst: T) {
          this.instances.add(inst)
          if (edges.has(inst)) return
          edges.set(inst, new Set())
          queue.push(inst)
        },
      }
      : null
    while (inst) {
      const { props = [], params = [] } = depsOf(inst)
      const revisedInstances = ctx?.instances ?? instances
      // NOTE: the following filter has side effect
      const deps = new Set([...props, ...params].filter(dep => {
        const { value, ..._dep } = dep
        if (revisedInstances.has(value)) return true
        const _ctx = {
          instances: revisedInstances,
          obj: inst!,
          ..._dep,
        } satisfies UnlistedInstanceContext<T>
        if (ctx?.onUnlistedInstance(value, _ctx)) {
          ctx.addNode(value)
          return true
        }
        return false
      }).map(dep => dep.value))
      // Add edges originating from `inst`
      // This also marks `inst` as visited
      edges.set(inst, deps)
      inst = queue.shift()
    }
    return new SimpleDiGraph(edges)
  }
}
