import { MetaKey, symbols } from '@/common'
import type { RuntimeCtorParamDependency } from '@/dependency/types'
import appendToArray from '@/helpers/metadata/appendToArray'
import type { AnyConstructor, Dependant } from '@/types'

export type DependsOnOptions<T extends AnyConstructor> =
  | (keyof InstanceType<T>)[]
  | {
    params?: number[] | ((clazz: T) => number[])
    props?: (keyof InstanceType<T>)[]
  }

/**
 * A decorator that tracks the dependencies of a class.
 *
 * This dependency information can be used to indicate that the decorated class
 * should be destroyed before its dependencies.
 *
 * It achieves this by doing the following:
 *
 * - Wrap the constructor to store dependencies in the constructor's parameters
 *   specified by `opts.params` in the `[symbols.ctorDeps]` property.
 * - Add the dependencies in properties specified by `opts.props` to the
 *   metadata on the class.
 *
 * @param opts - An array of property keys or an object describing the
 * properties and constructor parameters that the decorated class depends on.
 * @returns A decorator function that can be applied to a class.
 */
export default function DependsOn<T extends AnyConstructor>(
  opts: DependsOnOptions<T>,
) {
  return (clazz: T) => {
    if (opts instanceof Array) {
      appendToArray(MetaKey.DependsOnProps, opts, clazz)
      return
    }
    const { params, props = [] } = opts
    const newClazz = class extends clazz implements Dependant {
      public [symbols.ctorDeps]?: RuntimeCtorParamDependency[]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      public constructor(...args: any[]) {
        super(...args)
        const _params = typeof params === 'function'
          ? params(newClazz)
          : params
        if (!_params?.length) return
        const deps = this[symbols.ctorDeps] ?? []
        deps.push(..._params.map(index => ({
          value: args[index],
          param: index,
        } satisfies RuntimeCtorParamDependency)))
        Reflect.defineProperty(this, symbols.ctorDeps, {
          value: deps,
          configurable: true,
          enumerable: false,
          writable: true,
        })
      }
    }
    Reflect.defineProperty(newClazz, 'name', {
      value: clazz.name,
      writable: false,
      enumerable: false,
      configurable: true,
    })
    appendToArray(MetaKey.DependsOnProps, props, newClazz)
    /*
    SWC fucked up, adding `as T` fixes the error

    error TS4058: Return type of exported function has or is using name
    'symCtorDeps' from external module "src/common" but cannot be named.
    */
    return newClazz as T
  }
}
