import { AnyConstructor } from '@/types'
import { get } from './metadata'

/**
 * Retrieves the dependencies (properties and constructor parameters) of a
 * given class decorated with InversifyJS's `@inject` decorator.
 *
 * This function uses the `MetadataReader` from the `inversify` library to
 * extract the metadata associated with the class.
 *
 * The returned object contains two properties:
 * - `props`: an array of property keys that have the `@inject()` decorator
 *   applied.
 * - `params`: a function that returns an array of constructor parameter
 *   indexes that have the `@inject()` decorator applied.
 *
 * @param clazz - The class for which to retrieve the dependencies.
 * @returns An object containing the property and parameter dependencies of
 * the class.
 */
export default function getDeps<T extends AnyConstructor>(clazz: T) {
  const reader = get().reader
  const props = reader
    .getPropertiesMetadata(clazz)
    .map(([key, _kind]) => key)
  return {
    props,
    params: paramDepsOf,
  }
}

/**
 * The constructor parameter decorator are applied after class decorator,
 * hence delaying the evaluation of constructor parameter dependencies.
 *
 * Emitted code:
 *
 * ```TypeScript
 * TeamService = _ts_decorate([
 *   DependsOn(getDeps(TeamService)), // The class decorator
 *   injectable(),
 *   _ts_param(0, inject("DatabaseService")), // The parameter decorator
 *   _ts_metadata("design:type", Function),
 *   _ts_metadata("design:paramtypes", [
 *     typeof DatabaseService === "undefined" ? Object : DatabaseService
 *   ])
 * ], TeamService);
 * ```
 */
function paramDepsOf<T extends AnyConstructor>(clazz: T) {
  const reader = get().reader
  const params = reader
    .getConstructorMetadata(clazz)
    .map(([index, _kind]) => index)
  return params
}
