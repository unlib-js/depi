import get from './get'

export default function appendToArray(
  metadataKey: unknown,
  metadataValues: unknown[],
  target: object,
) {
  const data = get<unknown[]>(metadataKey, target) ?? []
  Reflect.defineMetadata(metadataKey, [...data, ...metadataValues], target)
}
