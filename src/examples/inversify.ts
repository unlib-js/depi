import 'reflect-metadata'

import Dependency from '@/decorators/Dependency'
import DependsOn from '@/decorators/DependsOn'
import { destroy } from '@/destroy'
import getDeps from '@/helpers/inversify/getDeps'
import { Container, inject, injectable, postConstruct } from 'inversify'
import { setTimeout } from 'node:timers/promises'

@injectable()
class Service implements AsyncDisposable {
  public readonly name = Reflect.getPrototypeOf(this)?.constructor.name
  protected readonly destroyDelay: number = 0
  @postConstruct()
  public async init() {
    console.log('Created', this.name)
  }

  public async [Symbol.asyncDispose]() {
    const { name, destroyDelay } = this
    console.log('Disposing', name)
    await setTimeout(destroyDelay)
    console.log('Disposed', name)
  }
}

const enum ServiceID {
  RemoteConfigService = 'RemoteConfigService',
  DatabaseService = 'DatabaseService',
  UserService = 'UserService',
  TeamService = 'TeamService',
}

@injectable()
class RemoteConfigService extends Service {
  protected override destroyDelay = 0
  public override toString() {
    return this.name
  }
}

// Get dependencies by finding `@inject` annotated properties
@DependsOn(getDeps(DatabaseService))
@injectable()
class DatabaseService extends Service {
  protected override destroyDelay = 100

  @inject(ServiceID.RemoteConfigService)
  private readonly remoteConfigService!: RemoteConfigService
  public constructor() {
    super()
    void this.remoteConfigService
  }

  public override toString() {
    return `${this.name} -> ${this.remoteConfigService}`
  }
}

@injectable()
class UserService extends Service {
  /*
  Intentially use a higher destroy delay to demonstrate how `destroy` wires up
  the destruction order
  */
  protected override destroyDelay = 300

  @Dependency() // Explicitly declare this property as a dependency
  @inject(ServiceID.RemoteConfigService)
  private readonly remoteConfigService!: RemoteConfigService
  @Dependency() // Explicitly declare this property as a dependency
  @inject(ServiceID.DatabaseService)
  private readonly databaseService!: DatabaseService

  public override toString() {
    return `${this.name} -> (${this.remoteConfigService}, ${this.databaseService})`
  }
}

/*
Get dependencies by intercepting the constructor parameters according to
`@inject` annotated parameters
*/
@DependsOn(getDeps(TeamService))
@injectable()
class TeamService extends Service {
  /*
  Intentially use a higher destroy delay to demonstrate how `destroy` wires up
  the destruction order
  */
  protected override destroyDelay = 300

  public constructor(
    @inject(ServiceID.DatabaseService)
    private readonly databaseService: DatabaseService,
  ) {
    super()
  }

  public override toString() {
    return `${this.name} -> ${this.databaseService}`
  }
}

const container = new Container()
container
  .bind<RemoteConfigService>(ServiceID.RemoteConfigService)
  .to(RemoteConfigService)
  .inSingletonScope()
container
  .bind<DatabaseService>(ServiceID.DatabaseService)
  .to(DatabaseService)
  .inSingletonScope()
container
  .bind<UserService>(ServiceID.UserService)
  .to(UserService)
  .inSingletonScope()
container
  .bind<TeamService>(ServiceID.TeamService)
  .to(TeamService)
  .inSingletonScope()

const [userSerivce, teamService] = await Promise.all([
  container.getAsync(ServiceID.UserService),
  container.getAsync(ServiceID.TeamService),
])

// Use services...

void userSerivce
void teamService

await destroy({
  instances: [
    container.get(ServiceID.RemoteConfigService),
    container.get(ServiceID.DatabaseService),
    container.get(ServiceID.UserService),
    container.get(ServiceID.TeamService),
  ],
  onCircularDependencyDetected(stack) {
    console.error(
      'Circular dependency detected:',
      stack.map(inst => (inst as object).constructor.name),
    )
  },
})

// Output:
// Created RemoteConfigService
// Created DatabaseService
// Created UserService
// Created TeamService
// Disposing UserService
// Disposing TeamService
// Disposed UserService
// Disposed TeamService
// Disposing DatabaseService
// Disposed DatabaseService
// Disposing RemoteConfigService
// Disposed RemoteConfigService
