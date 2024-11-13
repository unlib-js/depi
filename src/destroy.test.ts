import { setTimeout } from 'timers/promises'
import { describe, expect, it, vi } from 'vitest'
import DependsOn from './decorators/DependsOn'
import destroy from './destroy'
import DiGraph from './graph/DiGraph'

describe.concurrent('destroy', () => {
  function prepareDisposeLogging() {
    const logs: string[] = []
    const dispose = async function (this: NewableFunction) {
      const className = this.constructor.name
      logs.push(`pre disposing ${className}`)
      await setTimeout(Math.random() * 200)
      logs.push(`post disposing ${className}`)
    }
    function checkOrder(first: string, second: string) {
      expect(logs.indexOf(`post disposing ${first}`))
        .toBeLessThan(logs.indexOf(`pre disposing ${second}`))
    }
    return { logs, dispose, checkOrder }
  }

  function case0() {
    /*
    Dependency graph:

    UserService   TeamService
        |    |        |
        |    |        |
        |    |        |
        |    v        v
        |   DatabaseService
        |         |
        v         v
    RemoteConfigService
    */
    const { logs, dispose, checkOrder } = prepareDisposeLogging()

    class RemoteConfigService0 {
      public [Symbol.asyncDispose] = dispose
    }
    const remoteConfigService = new RemoteConfigService0()

    @DependsOn(['remoteConfigService'])
    class DatabaseService0 {
      public remoteConfigService = remoteConfigService
      public [Symbol.asyncDispose] = dispose
    }
    const databaseService = new DatabaseService0()

    @DependsOn(['remoteConfigService', 'databaseService'])
    class UserService0 {
      public remoteConfigService = remoteConfigService
      public databaseService = databaseService
      public [Symbol.asyncDispose] = dispose
    }
    const userService = new UserService0()

    @DependsOn(['databaseService'])
    class TeamService0 {
      public databaseService = databaseService
      public [Symbol.asyncDispose] = dispose
    }
    const teamService = new TeamService0()

    return {
      instances: [
        remoteConfigService,
        databaseService,
        userService,
        teamService,
      ],
      checkEdges(graph: DiGraph<unknown>) {
        expect(graph.childrenOf(remoteConfigService)).toEqual(new Set([
          databaseService,
          userService,
        ]))
        expect(graph.childrenOf(databaseService)).toEqual(new Set([
          userService,
          teamService,
        ]))
        expect(graph.childrenOf(userService)).toEqual(new Set([]))
        expect(graph.childrenOf(teamService)).toEqual(new Set([]))
      },
      checkDispose() {
        expect(logs).toHaveLength(4 * 2)
        checkOrder(UserService0.name, RemoteConfigService0.name)
        checkOrder(UserService0.name, DatabaseService0.name)
        checkOrder(TeamService0.name, DatabaseService0.name)
        checkOrder(DatabaseService0.name, RemoteConfigService0.name)
      },
    }
  }

  function case1() {
    /*
                UserService
                |         |
                |         |
    DatabaseService     CacheService
                |         |
                v         v
            RemoteConfigService
    */
    const { logs, dispose, checkOrder } = prepareDisposeLogging()

    class RemoteConfigService1 {
      public [Symbol.asyncDispose] = dispose
    }
    const remoteConfigService = new RemoteConfigService1()

    @DependsOn(['remoteConfigService'])
    class DatabaseService1 {
      public remoteConfigService = remoteConfigService
      public [Symbol.asyncDispose] = dispose
    }
    const databaseService = new DatabaseService1()

    @DependsOn(['remoteConfigService'])
    class CacheService1 {
      public remoteConfigService = remoteConfigService
      public [Symbol.asyncDispose] = dispose
    }
    const cacheService = new CacheService1()

    @DependsOn(['databaseService', 'cacheService'])
    class UserService1 {
      public databaseService = databaseService
      public cacheService = cacheService
      public [Symbol.asyncDispose] = dispose
    }
    const userService = new UserService1()

    return {
      instances: [
        remoteConfigService,
        databaseService,
        cacheService,
        userService,
      ],
      checkEdges(graph: DiGraph<unknown>) {
        expect(graph.childrenOf(remoteConfigService)).toEqual(new Set([
          databaseService,
          cacheService,
        ]))
        expect(graph.childrenOf(databaseService)).toEqual(new Set([
          userService,
        ]))
        expect(graph.childrenOf(cacheService)).toEqual(new Set([
          userService,
        ]))
      },
      checkDispose() {
        expect(logs).toHaveLength(4 * 2)
        checkOrder(UserService1.name, DatabaseService1.name)
        checkOrder(UserService1.name, CacheService1.name)
        checkOrder(DatabaseService1.name, RemoteConfigService1.name)
        checkOrder(CacheService1.name, RemoteConfigService1.name)
      },
    }
  }

  describe.concurrent('destroy', () => {
    function nameOf(inst: unknown) {
      return (inst as object).constructor.name
    }

    function namesOf(instances: unknown[]) {
      return instances.map(nameOf)
    }

    it('should work when no instances are passed', async () => {
      const onCircularDependencyDetected = vi.fn()
      await expect(destroy({
        instances: [],
        onCircularDependencyDetected,
      })).resolves.toBeUndefined()
      expect(onCircularDependencyDetected).not.toBeCalled()
    })

    it('should destroy independent instances', async () => {
      const dispose = vi.fn(() => Promise.resolve())
      class A {
        [Symbol.asyncDispose] = dispose
      }
      class B {
        [Symbol.asyncDispose] = dispose
      }
      class C {
        [Symbol.asyncDispose] = dispose
      }
      const onCircularDependencyDetected = vi.fn()
      await expect(destroy({
        instances: [
          new A(),
          new B(),
          new C(),
        ],
        onCircularDependencyDetected,
      })).resolves.toBeUndefined()
      expect(onCircularDependencyDetected).not.toBeCalled()
      expect(dispose).toBeCalledTimes(3)
    })

    it('should destroy instances with dependencies', {
      repeats: 10,
    }, async () => {
      const {
        instances,
        checkDispose,
      } = case0()
      const onCircularDependencyDetected = vi.fn()
      await expect(destroy({
        instances,
        onCircularDependencyDetected,
      })).resolves.toBeUndefined()
      expect(onCircularDependencyDetected).not.toBeCalled()
      checkDispose()
    })

    it('should destroy instances with dependencies', {
      repeats: 10,
    }, async () => {
      const {
        instances,
        checkDispose,
      } = case1()
      const onCircularDependencyDetected = vi.fn()
      await expect(destroy({
        instances,
        onCircularDependencyDetected,
      })).resolves.toBeUndefined()
      expect(onCircularDependencyDetected).not.toBeCalled()
      checkDispose()
    })

    it('should destroy independent groups of dependent instances', {
      repeats: 10,
    }, async () => {
      const group0 = case0()
      const group1 = case1()
      const onCircularDependencyDetected = vi.fn()
      await expect(destroy({
        instances: [
          ...group0.instances,
          ...group1.instances,
        ],
        onCircularDependencyDetected,
      })).resolves.toBeUndefined()
      expect(onCircularDependencyDetected).not.toBeCalled()
      group0.checkDispose()
      group1.checkDispose()
    })

    it('should destroy instances with circular dependency', async () => {
      // A <--> B
      const onCircularDependencyDetected = vi.fn()
      const dispose = vi.fn(() => Promise.resolve())
      @DependsOn(['b'])
      class A {
        public b?: B
        public [Symbol.asyncDispose] = dispose
      }
      @DependsOn(['a'])
      class B {
        public a?: A
        public [Symbol.asyncDispose] = dispose
      }
      const a = new A()
      const b = new B()
      a.b = b
      b.a = a
      await expect(destroy({
        instances: [a, b],
        onCircularDependencyDetected,
      })).resolves.toBeUndefined()
      expect(dispose).toBeCalledTimes(2)
      expect(onCircularDependencyDetected).toHaveBeenCalledOnce()
      const [stack] = onCircularDependencyDetected.mock.calls[0]
      expect(namesOf(stack)).toEqual(namesOf([a, b, a]))
    })

    it('should destroy instances with circular dependency', async () => {
      // A -> B -> C -> A
      const onCircularDependencyDetected = vi.fn()
      const dispose = vi.fn(() => Promise.resolve())
      @DependsOn(['b'])
      class A {
        public b?: B
        public [Symbol.asyncDispose] = dispose
      }
      @DependsOn(['c'])
      class B {
        public c?: C
        public [Symbol.asyncDispose] = dispose
      }
      @DependsOn(['a'])
      class C {
        public a?: A
        public [Symbol.asyncDispose] = dispose
      }
      const a = new A()
      const b = new B()
      const c = new C()
      a.b = b
      b.c = c
      c.a = a
      await expect(destroy({
        instances: [a, b, c],
        onCircularDependencyDetected,
      })).resolves.toBeUndefined()
      expect(dispose).toBeCalledTimes(3)
      expect(onCircularDependencyDetected).toHaveBeenCalledOnce()
      const [stack] = onCircularDependencyDetected.mock.calls[0]
      // Dependant graph: A -> C -> B -> A
      expect(namesOf(stack)).toEqual(namesOf([a, c, b, a]))
    })

    it('should destroy instances with circular dependency', async () => {
      // Fully connected graph
      const onCircularDependencyDetected = vi.fn()
      const dispose = vi.fn(() => Promise.resolve())
      @DependsOn(['b', 'c', 'd'])
      class A {
        public b?: B
        public c?: C
        public d?: D
        public [Symbol.asyncDispose] = dispose
      }
      @DependsOn(['c'])
      class B {
        public a?: A
        public c?: C
        public d?: D
        public [Symbol.asyncDispose] = dispose
      }
      @DependsOn(['a'])
      class C {
        public a?: A
        public b?: B
        public d?: D
        public [Symbol.asyncDispose] = dispose
      }
      @DependsOn(['a'])
      class D {
        public a?: A
        public b?: B
        public c?: C
        public [Symbol.asyncDispose] = dispose
      }
      const a = new A()
      const b = new B()
      const c = new C()
      const d = new D()
      a.b = b
      a.c = c
      a.d = d
      b.a = a
      b.c = c
      b.d = d
      c.a = a
      c.b = b
      c.d = d
      d.a = a
      d.b = b
      d.c = c
      await expect(destroy({
        instances: [a, b, c, d],
        onCircularDependencyDetected,
      })).resolves.toBeUndefined()
      expect(dispose).toBeCalledTimes(4)
      expect(onCircularDependencyDetected).toHaveBeenCalled()
    })

    it(
      'should destroy all instances even on presence of circular dependency',
      async () => {
        /*
        A -> B -> C -> D
        ^         |
        |         |
         \________/

        E; F -> G
        */
        const onCircularDependencyDetected = vi.fn()
        const _dispose = vi.fn((_: string) => Promise.resolve())
        function dispose(this: object) {
          return _dispose(this.constructor.name)
        }
        @DependsOn(['b'])
        class A {
          public b?: B
          public [Symbol.asyncDispose] = dispose
        }
        @DependsOn(['c'])
        class B {
          public c?: C
          public [Symbol.asyncDispose] = dispose
        }
        @DependsOn(['a', 'd'])
        class C {
          public a?: A
          public d?: D
          public [Symbol.asyncDispose] = dispose
        }
        class D {
          public [Symbol.asyncDispose] = dispose
        }
        const a = new A()
        const b = new B()
        const c = new C()
        const d = new D()
        a.b = b
        b.c = c
        c.a = a
        c.d = d
        // E; F -> G
        class E {
          public [Symbol.asyncDispose] = dispose
        }
        @DependsOn(['g'])
        class F {
          public g?: G
          public [Symbol.asyncDispose] = dispose
        }
        class G {
          public [Symbol.asyncDispose] = dispose
        }
        const e = new E()
        const f = new F()
        const g = new G()
        f.g = g
        await expect(destroy({
          instances: [a, b, c, d, e, f, g],
          onCircularDependencyDetected,
        })).resolves.toBeUndefined()
        expect(_dispose).toBeCalledTimes(7)
        expect(onCircularDependencyDetected).toHaveBeenCalled()
      },
    )
  })
})
