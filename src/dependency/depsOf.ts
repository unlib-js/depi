import { MetaKey, symbols } from '@/common'
import getMetadata from '@/helpers/metadata/get'
import type { Dependant } from '@/types'
import type {
  RuntimeCtorParamDependency,
  RuntimePropDependency,
} from './types'

/**
 * Retrieves the dependencies of the given instance.
 *
 * - Property dependencies are declared by the metadata of the class of the
 *   instance, identified by `MetaKey.DependsOnProps`.
 * - Constructor parameter dependencies are captured and stored in the property
 *   `[symbols.ctorDeps]`.
 *
 * @param inst - The instance to retrieve dependencies for.
 * @returns An object containing the instance's property dependencies and
 * constructor dependencies.
 */
export default function depsOf<T = unknown>(inst: T) {
  if (!inst) return {}
  const proto = Reflect.getPrototypeOf(inst)
  if (!proto) return {}
  type PropKeys = (string | number | symbol)[]
  const propKeys = getMetadata<PropKeys>(
    MetaKey.DependsOnProps,
    proto.constructor,
  ) ?? []
  const props = propKeys
    .flatMap<RuntimePropDependency<T>>(prop => {
      const value = Reflect.get(inst, prop, inst) as T
      if (shouldFlat<T>(value)) {
        return value.map<RuntimePropDependency<T>>((item, index) => ({
          value: item,
          prop,
          index,
        }))
      }
      return [{ value, prop }]
    })
    .filter(dep => dep.value) // Skip falsy prop values
  const params = ((inst as Partial<Dependant<T>>)[symbols.ctorDeps] ?? [])
    .flatMap<RuntimeCtorParamDependency<T>>(dep => {
      const { value, param } = dep
      if (shouldFlat<T>(value)) {
        return value.map<RuntimeCtorParamDependency<T>>((item, index) => ({
          value: item,
          param,
          index,
        }))
      }
      return [dep]
    })
    .filter(dep => dep.value) // Skip falsy values
  return { props, params }
}

function shouldFlat<T>(value: unknown): value is T[] {
  return typeof value === 'object' && !!value
    && !(Symbol.asyncDispose in value)
    && !(Symbol.dispose in value)
    && Array.isArray(value)
}
