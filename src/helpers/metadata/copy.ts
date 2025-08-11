import get from './get'

export default function copy(
  metadataKey: unknown,
  dst: object,
  src: object,
) {
  const metadata = get(metadataKey, src)
  if (metadata === undefined) return
  Reflect.defineMetadata(metadataKey, metadata, dst)
}
