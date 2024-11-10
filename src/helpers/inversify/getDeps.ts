import { AnyConstructor } from '@/types'
import { METADATA_KEY, MetadataReader } from 'inversify'

const { INJECT_TAG } = METADATA_KEY

export default function getDeps<T extends AnyConstructor>(clazz: T) {
  const reader = new MetadataReader()
  const propMeta = reader.getPropertiesMetadata(clazz)
  const props = Object.entries(propMeta)
    .map(([key, meta]) =>
      meta.find(_meta => _meta.key === INJECT_TAG) ? key : null)
    .filter(key => key !== null) as (keyof InstanceType<T>)[]
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
  const reader = new MetadataReader()
  const ctorMeta = reader.getConstructorMetadata(clazz).userGeneratedMetadata
  const params = Object.entries(ctorMeta)
    .map(([index, meta]) =>
      meta.find(_meta => _meta.key === INJECT_TAG) ? parseInt(index) : null)
    .filter(index => index !== null)
  return params
}
