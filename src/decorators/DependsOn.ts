import { MetaKey, symbols } from '@/common'
import appendToArray from '@/helpers/metadata/appendToArray'
import type { AnyConstructor, Dependant } from '@/types'

export type DependsOnOptions<T extends AnyConstructor> =
  | (keyof InstanceType<T>)[]
  | { params?: number[], props?: (keyof InstanceType<T>)[] }

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
      appendToArray(MetaKey.DependsOn, opts, clazz)
      return
    }
    const { params } = opts
    const newClazz = class extends clazz implements Dependant {
      public [symbols.ctorDeps]!: any[]
      public constructor(...args: any[]) {
        super(...args)
        this[symbols.ctorDeps] ??= []
        this[symbols.ctorDeps].push(...params?.map(index => args[index]) ?? [])
      }
    }
    Reflect.defineProperty(newClazz, 'name', {
      value: clazz.name,
      writable: false,
      enumerable: false,
      configurable: true,
    })
    appendToArray(MetaKey.DependsOn, opts.props ?? [], newClazz)
    /*
    SWC fucked up, adding `as T` fixes the error

    error TS4058: Return type of exported function has or is using name 'symDeps' from external module "src/common" but cannot be named.
    */
    return newClazz as T
  }
}
