export interface RuntimeDependency<T = unknown> {
  value: T
}

export interface RuntimePropDependency<T = unknown>
  extends RuntimeDependency<T> {
  /**
   * The property key of the property dependency
   */
  prop: string | number | symbol
}

export interface RuntimeCtorParamDependency<T = unknown>
  extends RuntimeDependency<T> {
  /**
   * The index of the constructor parameter dependency
   */
  param: number
}

export type UnlistedInstanceContext<T = unknown> = {
  /**
   * Listed instances
   */
  instances: Set<T>
  obj: T
} & ({
  prop: string | number | symbol
} | {
  param: number
})
