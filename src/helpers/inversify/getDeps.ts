import { AnyConstructor } from '@/types'
import { METADATA_KEY, MetadataReader } from 'inversify'

const { INJECT_TAG } = METADATA_KEY

export default function getDeps<T extends AnyConstructor>(clazz: T) {
  const reader = new MetadataReader()
  const ctorMeta = reader.getConstructorMetadata(clazz).userGeneratedMetadata
  const params = Object.entries(ctorMeta)
    .map(([index, meta]) =>
      meta.find(_meta => _meta.key === INJECT_TAG) ? parseInt(index) : null)
    .filter(index => index !== null)
  const propMeta = reader.getPropertiesMetadata(clazz)
  const props = Object.entries(propMeta)
    .map(([key, meta]) =>
      meta.find(_meta => _meta.key === INJECT_TAG) ? key : null)
    .filter(key => key !== null) as (keyof InstanceType<T>)[]
  return { params, props }
}
