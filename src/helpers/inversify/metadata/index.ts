import * as mod from 'inversify'
import type { MetadataReader as IMetadataReader } from './types'
import * as v6 from './v6'
import * as v7 from './v7'

type Mod6 = typeof import('inversify-6')
type Mod7 = typeof import('inversify-7')

let exports: {
  reader: IMetadataReader
  metadataKeys: (string | number | symbol)[]
} | null = null

export function get() {
  if (exports) return exports
  exports = (() => {
    if ('METADATA_KEY' satisfies keyof Mod6 in mod) {
      v6.setMod(mod as unknown as Mod6)
      const { METADATA_KEY } = mod as unknown as Mod6
      return {
        reader: new v6.default(),
        metadataKeys: [METADATA_KEY.TAGGED_PROP, METADATA_KEY.TAGGED],
      }
    }
    if ('injectFromBase' satisfies keyof Mod7 in mod) {
      return {
        reader: new v7.default(),
        metadataKeys: [v7.metadataKey],
      }
    }
    throw new Error('Unknown version of Inversify (supported versions: v6, v7')
  })()
  return exports
}
