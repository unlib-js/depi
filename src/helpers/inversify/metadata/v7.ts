import 'reflect-metadata'
import {
  InjectionKind,
  type MetadataReader as IMetadataReader,
  type ParameterInejectionMetadata,
  type PropertyInjectionMetadata,
} from './types'

const kinds = new Map([
  [0, InjectionKind.MULTI],
  [1, InjectionKind.SINGLE],
  [2, InjectionKind.UNMANAGED],
])

export const metadataKey = '@inversifyjs/core/classMetadataReflectKey'

interface ClassMetadata {
  constructorArguments: { kind: number }[]
  properties: Map<string | symbol, { kind: number }>
}

export default class MetadataReader implements IMetadataReader {
  public getPropertiesMetadata(
    ctor: NewableFunction,
  ): PropertyInjectionMetadata {
    const {
      properties,
    } = Reflect.getMetadata(metadataKey, ctor) as ClassMetadata | undefined
      ?? {}
    const props: PropertyInjectionMetadata = []
    if (!properties) return props
    for (const [key, meta] of properties) {
      const kind = kinds.get(meta.kind)
      if (kind === undefined) continue
      props.push([key, kind])
    }
    return props
  }

  public getConstructorMetadata(
    ctor: NewableFunction,
  ): ParameterInejectionMetadata {
    const {
      constructorArguments = [],
    } = Reflect.getMetadata(metadataKey, ctor) as ClassMetadata | undefined
      ?? {}
    return constructorArguments
      .map<[number, InjectionKind] | null>((meta, index) => {
        const kind = kinds.get(meta?.kind)
        if (kind === undefined) return null
        return [index, kind]
      })
      .filter(entry => !!entry)
  }
}
