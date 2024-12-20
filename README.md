# Depi: Async Disposal with Dependencies

A library for managing asynchronous disposal of objects with dependencies, with built-in support for [InversifyJS](https://github.com/inversify/InversifyJS).

- [Depi: Async Disposal with Dependencies](#depi-async-disposal-with-dependencies)
  - [Features](#features)
  - [Motivation](#motivation)
  - [Installation](#installation)
    - [Setup GitHub Packages Registry](#setup-github-packages-registry)
    - [Add Depi to Your Project](#add-depi-to-your-project)
      - [pNpm](#pnpm)
      - [Yarn](#yarn)
      - [npm](#npm)
  - [Usage](#usage)
    - [Basic Usage](#basic-usage)
    - [With InversifyJS](#with-inversifyjs)
    - [Run Examples](#run-examples)
  - [Development](#development)
    - [Build](#build)
    - [Build Docs](#build-docs)
    - [Test](#test)
  - [API](#api)
  - [How it Works](#how-it-works)
  - [Cicular Dependency Behavior](#cicular-dependency-behavior)
  - [License](#license)

## Features

* Asynchronous disposal of objects in dependency order.
* Circular dependency detection (**circular dependency is strongly discouraged**).
* Use existing interfaces `Disposable` and `AsyncDisposable`.
* Built-in support of extracting dependencies from the [`@inject`](https://github.com/inversify/InversifyJS?tab=readme-ov-file#step-2-declare-dependencies-using-the-injectable--inject-decorators) annotation of InversifyJS.
* Also works without InversifyJS.

## Motivation

In many cases, we need to dispose of objects in a specific order, especially when dealing with asynchronous operations. For example, say `UserService` depends on `DatabaseService`, `UserService` is only usable when `DatabaseService` is ready. Therefore, `UserService` should be disposed before `DatabaseService`. Otherwise, the state "`UserService` is still marked as available, but `DatabaseService` is destroyed" is possible, allowing other part of the program to use `UserService` when its dependency `DatabaseService` is no longer available.

Manually managing disposal order can be error-prone and difficult to maintain. While "disposing objects in the reverse order of their creation" sounds like exactly the job of dependency injection library, none of them in JS world provides this feature -- at least not the ones I know of. In the Java empire, this is part of the dependency injection features of [Spring Framework](https://github.com/spring-projects/spring-framework/blob/2e6c8daec639b8194bf191b9f67056cde2a18f48/spring-beans/src/main/java/org/springframework/beans/factory/support/DefaultSingletonBeanRegistry.java#L643C29-L644).

Related discussions:

* https://github.com/inversify/InversifyJS/issues/1606
* https://github.com/nestjs/nest/issues/4599#issuecomment-2257682983

## Installation

### Setup GitHub Packages Registry

Firstly follow the [GitHub Packages Registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages) to set up authentication to the GitHub Package Registry.

Then, add the following line to your [`.npmrc`](https://docs.npmjs.com/cli/v9/configuring-npm/npmrc?v=true) file under your project root:

```
@unlib-js:registry=https://npm.pkg.github.com
```

### Add Depi to Your Project

#### pNpm

```
pnpm add @unlib-js/depi
```

#### Yarn

```
yarn add @unlib-js/depi
```

#### npm

```
npm install @unlib-js/depi
```

## Usage

### Basic Usage

```TypeScript
import { setTimeout } from 'node:timers/promises'
import { destroy } from '@unlib-js/depi'
import DependsOn from '@unlib-js/depi/decorators/DependsOn'
import Dependency from '@unlib-js/depi/decorators/Dependency'

class RemoteConfigService implements AsyncDisposable {
  public async [Symbol.asyncDispose]() {
    console.log('Destroyed DatabaseService')
  }
}
const remoteConfigService = new RemoteConfigService()

class DatabaseService implements AsyncDisposable {
  @Dependency()
  private readonly remoteConfigService = remoteConfigService

  public async [Symbol.asyncDispose]() {
    console.log('Destroyed DatabaseService')
  }
}
const databaseService = new DatabaseService()

@DependsOn(['databaseService'])
class UserService implements AsyncDisposable {
  private readonly databaseService = databaseService
  public async [Symbol.asyncDispose]() {
    await setTimeout(1000) // Simulate some async work
    console.log('Destroyed UserService')
  }
}
const userService = new UserService()
// Now `userService` depends on its property `databaseService`

await destroy({
  instances: [databaseSerivce, userService],
  onCircularDependencyDetected(stack, graph) {
    console.warn('Circular dependency detected:', stack)
  }
})

// Output:
// Destroyed UserService
// Destroyed DatabaseService
// Destroyed RemoteConfigService
```

### With InversifyJS

```TypeScript
import { setTimeout } from 'node:timers/promises'
import { Container, injectable, inject } from 'inversify'
import { destroy } from '@unlib-js/depi'
import DependsOn from '@unlib-js/depi/decorators/DependsOn'
import getDeps from '@unlib-js/depi/helpers/inversify/getDeps'

@injectable()
class RemoteConfigService implements AsyncDisposable {
  public async [Symbol.asyncDispose]() {
    console.log('Destroyed RemoteConfigService')
  }
}

@DependsOn(getDeps(DatabaseService))
@injectable()
class DatabaseService implements AsyncDisposable {
  public constructor(
    @inject(RemoteConfigService)
    private readonly remoteConfigService: RemoteConfigService,
  ) {}
  public async [Symbol.asyncDispose]() {
    await setTimeout(500) // Simulate some async work
    console.log('Destroyed DatabaseService')
  }
}

@DependsOn(getDeps(UserService))
@injectable()
class UserService {
  @inject(RemoteConfigService)
  private readonly remoteConfigService!: RemoteConfigService
  public constructor(
    @inject(DatabaseService)
    databaseService: DatabaseService,
  ) {
    // ...
  }

  public async [Symbol.asyncDispose]() {
    await setTimeout(1000) // Simulate some async work
    console.log('Destroyed UserService')
  }
}

const container = new Container()
container.bind(RemoteConfigService).toSelf().inSingletonScope()
container.bind(DatabaseService).toSelf().inSingletonScope()
container.bind(UserService).toSelf().inSingletonScope()

const userService = await container.getAsync(UserService)

// ...

// During application shutdown:
await destroy({
  instances: [
    container.get(RemoteConfigService),
    container.get(DatabaseService),
    container.get(UserService),
  ],
  onCircularDependencyDetected(stack, graph) {
    console.warn('Circular dependency detected:', stack)
  }
})

// Output:
// Destroyed UserService
// Destroyed DatabaseService
// Destroyed RemoteConfigService
```

### Run Examples

```
pnpm example basic
pnpm example inversify
```

For more examples, please refer to the tests, e.g., this [test](./src/integration.test.ts).

## Development

### Build

```
pnpm i && pnpm build
```

### Build Docs

```
pnpm typedoc
```

### Test

```
pnpm test
```

## API

See [here](./docs/README.md).

## How it Works

1. Build a **reversed dependency graph** from the provided instances.
2. Traverse the graph in leaf-first order. For each node, enqueue the following async disposal task:
  1. Wait for all dependants of the node, i.e., child nodes, to complete their disposal.
  2. Dispose the node itself.
3. Wait for all queued tasks to complete.

## Cicular Dependency Behavior

Circular dependencies are generally discouraged. However, if there is a loop, the library invokes the `onCircularDependencyDetected` callback with the stack of detected circular dependency (a loop path), and ignores the edge that caused the loop as if it were not there.

## License

TODO
