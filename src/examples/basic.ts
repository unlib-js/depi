import 'reflect-metadata'

import Dependency from '@/decorators/Dependency'
import DependsOn from '@/decorators/DependsOn'
import { destroy } from '@/destroy'
import { setTimeout } from 'timers/promises'

class Service implements AsyncDisposable {
  public async [Symbol.asyncDispose]() {
    const name = Reflect.getPrototypeOf(this)?.constructor.name
    console.log('Disposing', name)
    await setTimeout(Math.random() * 500)
    console.log('Disposed', name)
  }
}

class ServiceA extends Service {}
const serviceA = new ServiceA()

@DependsOn(['serviceA'])
class ServiceB extends Service {
  /**
   * Marking this as protected or private hides it from `keyof ServiceB`.
   * The workaround is make it public and mark it as `@internal`.
   *
   * @internal
   */
  public readonly serviceA = serviceA
}
const serviceB = new ServiceB()

@DependsOn({
  params: [0], // 0 is the index of the constructor parameter `serviceB`
})
class ServiceC extends Service {
  public constructor(
    private readonly serviceB: ServiceB,
  ) {
    super()
    void this.serviceB
  }
}
const serviceC = new ServiceC(serviceB)

class ServiceD extends Service {
  @Dependency() // Or if you don't want to use `@internal`
  private readonly serviceC = serviceC
  public workHard() {
    // ...
    void this.serviceC
  }
}
const serviceD = new ServiceD()

await destroy({
  instances: [
    serviceA,
    serviceB,
    serviceC,
    serviceD,
  ],
  onCircularDependencyDetected(stack) {
    console.error('Circular dependency detected:', stack)
  },
})

// Output:
// Disposing ServiceD
// Disposed ServiceD
// Disposing ServiceC
// Disposed ServiceC
// Disposing ServiceB
// Disposed ServiceB
// Disposing ServiceA
// Disposed ServiceA
