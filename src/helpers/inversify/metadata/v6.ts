import type { MetadataReader as Reader } from 'inversify-6'
import {
  InjectionKind,
  ParameterInejectionMetadata,
  type MetadataReader as IMetadataReader,
  type PropertyInjectionMetadata,
} from './types'

export type Mod6 = Pick<
  typeof import('inversify-6'),
  'METADATA_KEY' | 'MetadataReader'
>

let env: {
  mod: Mod6
  kinds: Map<string | number | symbol, InjectionKind>
} | null = null

export function setMod(inversify: Mod6) {
  env = {
    mod: inversify,
    kinds: new Map([
      [inversify.METADATA_KEY.INJECT_TAG, InjectionKind.SINGLE],
      [inversify.METADATA_KEY.MULTI_INJECT_TAG, InjectionKind.MULTI],
      [inversify.METADATA_KEY.UNMANAGED_TAG, InjectionKind.UNMANAGED],
      // We don't care about the rest
    ]),
  }
}

function getEnv() {
  if (!env) {
    throw new Error('BUG: Inversify module is not set')
  }
  return env
}

export default class MetadataReader implements IMetadataReader {
  private getReader(): Reader {
    const { MetadataReader: Reader } = getEnv().mod
    return new Reader()
  }

  public getPropertiesMetadata(
    ctor: NewableFunction,
  ): PropertyInjectionMetadata {
    const reader = this.getReader()
    const kinds = getEnv().kinds
    const propsMeta = reader.getPropertiesMetadata(ctor)
    return Object.entries(propsMeta)
      .map<[string | symbol, InjectionKind] | null>(([key, metas]) => {
        for (const meta of metas) {
          const kind = kinds.get(meta.key)
          if (kind === undefined) continue
          return [key, kind]
        }
        return null
      })
      .filter(entry => !!entry)
  }

  public getConstructorMetadata(
    ctor: NewableFunction,
  ): ParameterInejectionMetadata {
    const reader = this.getReader()
    const kinds = getEnv().kinds
    const ctorMeta = reader.getConstructorMetadata(ctor).userGeneratedMetadata
    return Object.entries(ctorMeta)
      .map<[number, InjectionKind] | null>(([index, metas]) => {
        for (const meta of metas) {
          const kind = kinds.get(meta.key)
          if (kind === undefined) continue
          return [parseInt(index), kind]
        }
        return null
      })
      .filter(entry => !!entry)
  }
}
