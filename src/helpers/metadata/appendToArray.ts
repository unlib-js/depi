import get from './get'

export default function appendToArray(
  metadataKey: any,
  metadataValues: any[],
  target: Object,
) {
  const data = get<any[]>(metadataKey, target) ?? []
  Reflect.defineMetadata(metadataKey, [...data, ...metadataValues], target)
}
