import { MetaKey, symbols } from '@/common'
import getMetadata from '@/helpers/metadata/get'
import { Dependant } from '@/types'
import { RuntimePropDependency } from './types'

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
    .map(prop => ({
      value: Reflect.get(inst, prop, inst) as T,
      prop,
    } satisfies RuntimePropDependency<T>))
    .filter(dep => dep.value) // Skip falsy prop values
  const params = (inst as Partial<Dependant<T>>)[symbols.ctorDeps] ?? []
  return { props, params }
}
