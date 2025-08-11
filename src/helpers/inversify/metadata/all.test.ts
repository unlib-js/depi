import * as mod6 from 'inversify-6'
import * as mod7 from 'inversify-7'
import { beforeAll, describe, it } from 'vitest'
import {
  assertCtorMetadata,
  assertPropMetadata,
  mkClassesWithCtorParams,
  mkClassesWithProps,
} from './testUtils'
import {
  InjectionKind,
  type MetadataReader as IMetadataReader,
} from './types'
import MetadataReader6, { setMod } from './v6'
import MetadataReader7 from './v7'

function defineCases(
  mod: typeof import('inversify-6') | typeof import('inversify-7'),
  reader: IMetadataReader,
) {
  it('should correctly read properties metadata', () => {
    const {
      RemoteConfigService,
      DatabaseService,
      UserService,
      WhateverService,
    } = mkClassesWithProps(mod)

    assertPropMetadata(reader, RemoteConfigService, [])
    assertPropMetadata(reader, DatabaseService, [
      [
        'remoteConfigService',
        InjectionKind.SINGLE,
      ],
    ])
    assertPropMetadata(reader, UserService, [
      ['remoteConfigService', InjectionKind.SINGLE],
      ['databaseService', InjectionKind.SINGLE],
    ])
    assertPropMetadata(reader, WhateverService, [
      ['remoteConfigServices', InjectionKind.MULTI],
    ])
  })

  it('should correctly read constructor metadata', () => {
    const {
      RemoteConfigService,
      DatabaseService,
      UserService,
      WhateverService,
    } = mkClassesWithCtorParams(mod)

    assertCtorMetadata(reader, RemoteConfigService, [])
    assertCtorMetadata(reader, DatabaseService, [
      [
        0,
        InjectionKind.SINGLE,
      ],
    ])
    assertCtorMetadata(reader, UserService, [
      [0, InjectionKind.SINGLE],
      [1, InjectionKind.SINGLE],
    ])
    assertCtorMetadata(reader, WhateverService, [
      [0, InjectionKind.MULTI],
    ])
  })
}

describe('MetadataReader for Inversify v6', () => {
  beforeAll(() => setMod(mod6))
  defineCases(mod6, new MetadataReader6())
})

describe('MetadataReader for Inversify v7', () => {
  defineCases(mod7, new MetadataReader7())
})
