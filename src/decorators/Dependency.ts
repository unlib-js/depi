import { MetaKey } from '@/common'
import appendToArray from '@/helpers/metadata/appendToArray'

/**
 * A decorator function that marks a property as a dependency for the class it
 * is applied to.
 *
 * The marked property will be added to the `MetaKey.DependsOnProps` metadata
 * array for the class.
 */
export default function Dependency() {
  return (proto: object, propertyKey: string | symbol) => {
    appendToArray(MetaKey.DependsOnProps, [propertyKey], proto.constructor)
  }
}
