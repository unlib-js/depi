import type { symbols } from './common'

export type AnyConstructor = new (...args: any[]) => any

export interface Dependant {
  /**
   * The constructor parameters that this object depends on.
   *
   * Property dependencies are recorded in the `MetaKey.DependsOnProps`
   * metadata.
   */
  readonly [symbols.ctorDeps]?: unknown[]
}
