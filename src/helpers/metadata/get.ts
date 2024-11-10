export default function get<T>(
  metadataKey: string,
  target: unknown,
): T | undefined {
  if (!target) return
  return Reflect.getMetadata(metadataKey, target)
}
