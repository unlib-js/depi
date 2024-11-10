import { Container, inject, injectable } from 'inversify'
import { setTimeout } from 'timers/promises'
import { describe, expect, it, vi } from 'vitest'
import { MetaKey } from './common'
import DependsOn from './decorators/DependsOn'
import { destroy } from './destroy'
import getDeps from './helpers/inversify/getDeps'
import get from './helpers/metadata/get'

describe.concurrent('Integration with Inversify', () => {
  it('should work', { repeats: 10 }, async () => {
    const logs: string[] = []
    async function dispose(this: NewableFunction) {
      const className = this.constructor.name
      logs.push(`pre disposing ${className}`)
      await setTimeout(Math.random() * 200)
      logs.push(`post disposing ${className}`)
    }
    function checkOrder(first: string, second: string) {
      expect(logs.indexOf(`post disposing ${first}`))
        .toBeLessThan(logs.indexOf(`pre disposing ${second}`))
    }

    class Service {
      public [Symbol.asyncDispose] = dispose
    }

    const container = new Container()

    @injectable()
    class RemoteConfigService extends Service {}
    container.bind(RemoteConfigService).toSelf().inSingletonScope()

    @DependsOn(getDeps(DatabaseService))
    @injectable()
    class DatabaseService extends Service {
      @inject(RemoteConfigService)
      public remoteConfigService?: RemoteConfigService
    }
    container.bind(DatabaseService).toSelf().inSingletonScope()

    @DependsOn(getDeps(UserService))
    @injectable()
    class UserService extends Service {
      @inject(RemoteConfigService)
      public remoteConfigService?: RemoteConfigService
      @inject(DatabaseService)
      public databaseService?: DatabaseService
    }
    container.bind(UserService).toSelf().inSingletonScope()

    @DependsOn(getDeps(TeamService))
    @injectable()
    class TeamService extends Service {
      @inject(DatabaseService)
      public databaseService?: DatabaseService
    }
    container.bind(TeamService).toSelf().inSingletonScope()

    expect(get(MetaKey.DependsOnProps, UserService))
      .toEqual(['remoteConfigService', 'databaseService'])
    expect(get(MetaKey.DependsOnProps, TeamService))
      .toEqual(['databaseService'])
    expect(get(MetaKey.DependsOnProps, DatabaseService))
      .toEqual(['remoteConfigService'])
    expect(get(MetaKey.DependsOnProps, RemoteConfigService)).toBeUndefined()

    const [ userSerivce, teamService ] = await Promise.all([
      container.getAsync(UserService),
      container.getAsync(TeamService),
    ])
    const remoteConfigService = container.get(RemoteConfigService)
    const databaseService = container.get(DatabaseService)
    expect(userSerivce.remoteConfigService).toBe(remoteConfigService)
    expect(userSerivce.databaseService).toBe(databaseService)
    expect(teamService.databaseService).toBe(databaseService)
    expect(databaseService.remoteConfigService).toBe(remoteConfigService)

    const onCircularDependencyDetected = vi.fn()
    await expect(destroy({
      instances: [
        container.get(RemoteConfigService),
        container.get(DatabaseService),
        container.get(UserService),
        container.get(TeamService),
      ],
      onCircularDependencyDetected,
    })).resolves.toBeUndefined()
    console.debug(logs)
    expect(onCircularDependencyDetected).not.toHaveBeenCalled()
    checkOrder(UserService.name, RemoteConfigService.name)
    checkOrder(UserService.name, DatabaseService.name)
    checkOrder(TeamService.name, DatabaseService.name)
    checkOrder(DatabaseService.name, RemoteConfigService.name)
  })
})
