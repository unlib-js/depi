export interface RuntimeDependency<T = unknown> {
  value: T
  /**
   * If the original value is an array, the index of `value` in the array
   */
  index?: number
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
   * Listed instances, including the ones that are added during the traversal
   * process.
   */
  instances: Set<T>
  /**
   * The parent object that contains the unlisted instance as a dependency.
   */
  obj: T
} & ({
  /**
   * The property key of the property dependency.
   *
   * This holds: `obj[prop] === unlistedInst`.
   */
  prop: string | number | symbol
} | {
  /**
   * The index of the constructor parameter dependency.
   *
   * This is the index of the unlisted instance among the constructor
   * parameters.
   */
  param: number
})
