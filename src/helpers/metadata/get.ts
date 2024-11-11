export default function get<T>(
  metadataKey: unknown,
  target: unknown,
): T | undefined {
  if (!target) return
  return Reflect.getMetadata(metadataKey, target)
}
