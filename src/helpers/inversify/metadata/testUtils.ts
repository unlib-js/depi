import { expect } from 'vitest'
import type {
  MetadataReader,
  ParameterInejectionMetadata,
  PropertyInjectionMetadata,
} from './types'

function injectable<T extends NewableFunction>(
  mod: typeof import('inversify-6') | typeof import('inversify-7'),
) {
  return function (target: T) {
    return (mod.injectable as () => (t: T) => T)()(target)
  }
}

export function mkClassesWithProps(
  mod: typeof import('inversify-6') | typeof import('inversify-7'),
) {

  @((mod as typeof import('inversify-6')).injectable())
  class RemoteConfigService {}

  injectable(mod)
  class DatabaseService {
    @mod.inject(RemoteConfigService)
    private readonly remoteConfigService!: RemoteConfigService
  }

  injectable(mod)
  class UserService {
    @mod.inject(RemoteConfigService) @mod.named('wtf')
    private readonly remoteConfigService!: RemoteConfigService
    @mod.inject(DatabaseService)
    private readonly databaseService!: DatabaseService
  }

  injectable(mod)
  class WhateverService {
    @mod.multiInject(RemoteConfigService)
    private readonly remoteConfigServices!: RemoteConfigService[]
  }

  return {
    RemoteConfigService,
    DatabaseService,
    UserService,
    WhateverService,
  }
}

export function mkClassesWithCtorParams(
  mod: typeof import('inversify-6') | typeof import('inversify-7'),
) {
  injectable(mod)
  class RemoteConfigService {}

  injectable(mod)
  class DatabaseService {
    public constructor(
      @mod.inject(RemoteConfigService)
      public readonly remoteConfigService: RemoteConfigService,
    ) {}
  }

  injectable(mod)
  class UserService {
    public constructor(
      @mod.inject(RemoteConfigService) @mod.named('wtf')
      public readonly remoteConfigService: RemoteConfigService,
      @mod.inject(DatabaseService)
      public readonly databaseService: DatabaseService,
    ) {}
  }

  injectable(mod)
  class WhateverService {
    public constructor(
      @mod.multiInject(RemoteConfigService)
      public readonly remoteConfigServices: RemoteConfigService[],
    ) {}
  }

  return {
    RemoteConfigService,
    DatabaseService,
    UserService,
    WhateverService,
  }
}

export function assertPropMetadata(
  reader: MetadataReader,
  ctor: NewableFunction,
  expected: PropertyInjectionMetadata,
) {
  const propsMeta = reader.getPropertiesMetadata(ctor)
  expect(propsMeta).toEqual(expected)
}

export function assertCtorMetadata(
  reader: MetadataReader,
  ctor: NewableFunction,
  expected: ParameterInejectionMetadata,
) {
  const propsMeta = reader.getConstructorMetadata(ctor)
  expect(propsMeta).toEqual(expected)
}
