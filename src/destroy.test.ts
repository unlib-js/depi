import { setTimeout } from 'timers/promises'
import { describe, expect, it, vi } from 'vitest'
import DependsOn from './decorators/DependsOn'
import { dependantGraphOf, depsOf, destroy } from './destroy'
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
      remoteConfigService,
      databaseService,
      userService,
      teamService,
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
      remoteConfigService,
      databaseService,
      cacheService,
      userService,
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

  describe.concurrent('depsOf', () => {
    it('should return empty for a class with no dependencies', () => {
      class A {}
      const { params = [], props = [] } = depsOf(new A())
      expect(params?.length).toBeFalsy()
      expect(props?.length).toBeFalsy()
    })

    it('should retrieve property dependencies correctly', () => {
      @DependsOn(['foo', 'baz'])
      class A {
        public foo = 'foo'
        public bar = 'bar'
        public baz = 'baz'
      }
      const aObj = new A()
      const { props = [] } = depsOf(aObj)
      expect(props).toEqual(['foo', 'baz'])
    })

    it('should retrieve parameter dependencies correctly', () => {
      @DependsOn({
        params: [0, 2],
      })
      class A {
        public constructor(
          public foo: string,
          public bar: string,
          public baz: string,
          public qux: string,
        ) {}
      }
      const aObj = new A('foo', 'bar', 'baz', 'qux')
      const { params = [] } = depsOf(aObj)
      expect(params).toEqual(['foo', 'baz'])
    })

    it(
      'should retrieve both property and ' +
      'parameter dependencies correctly',
      () => {
        @DependsOn({
          params: [0, 2],
          props: ['prop0', 'prop2'],
        })
        class A {
          public prop0 = 'prop-val-0'
          public prop1 = 'prop-val-1'
          public prop2 = 'prop-val-2'
          public prop3 = 'prop-val-3'
          public constructor(
            public param0: string,
            public param1: string,
            public param2: string,
            public param3: string,
          ) {}
        }
        const aObj = new A(
          'param-val-0',
          'param-val-1',
          'param-val-2',
          'param-val-3',
        )
        const { params = [], props = [] } = depsOf(aObj)
        expect(params).toEqual(['param-val-0', 'param-val-2'])
        expect(props).toEqual(['prop-val-0', 'prop-val-2'])
      })
  },
  )

  describe.concurrent('dependantGraphOf', () => {
    it('should return an empty graph for an empty array', () => {
      const graph = dependantGraphOf([])
      expect([...graph.nodes()]).toEqual([])
      expect([...graph.entries()]).toEqual([])
    })

    it('should return a graph with a single node for a single instance', () => {
      class A {}
      const aObj = new A()
      const graph = dependantGraphOf([aObj])
      expect([...graph.nodes()]).toEqual([aObj])
      expect([...graph.entries()]).toEqual([[aObj, new Set()]])
    })

    it(
      'should return a graph with isolated nodes for independent instances',
      () => {
        class A {}
        class B {}
        const aObj = new A()
        const bObj = new B()
        const graph = dependantGraphOf([aObj, bObj])
        expect([...graph.nodes()]).toEqual([aObj, bObj])
        expect([...graph.entries()]).toEqual([
          [aObj, new Set()],
          [bObj, new Set()],
        ])
      },
    )

    it('should return a correct graph', () => {
      const {
        remoteConfigService,
        databaseService,
        userService,
        teamService,
        checkEdges,
      } = case0()

      const graph = dependantGraphOf([
        remoteConfigService,
        databaseService,
        userService,
        teamService,
      ])
      expect(new Set(graph.nodes())).toEqual(new Set([
        remoteConfigService,
        databaseService,
        userService,
        teamService,
      ]))
      checkEdges(graph)
    })

    it('should return a correct graph', () => {
      const {
        remoteConfigService,
        databaseService,
        cacheService,
        userService,
        checkEdges,
      } = case1()

      const graph = dependantGraphOf([
        remoteConfigService,
        databaseService,
        cacheService,
        userService,
      ])
      expect(new Set([...graph.nodes()])).toEqual(new Set([
        remoteConfigService,
        databaseService,
        cacheService,
        userService,
      ]))
      checkEdges(graph)
    })

    it('should return a correct graph', () => {
      const group0 = case0()
      const group1 = case1()
      const graph = dependantGraphOf([
        ...Object.values(group0),
        ...Object.values(group1),
      ])
      expect(new Set(graph.nodes())).toEqual(new Set([
        ...Object.values(group0),
        ...Object.values(group1),
      ]))
      group0.checkEdges(graph)
      group1.checkEdges(graph)
    })
  })

  describe.concurrent('destroyAllAsync', () => {
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
        remoteConfigService,
        databaseService,
        userService,
        teamService,
        checkDispose,
      } = case0()
      const onCircularDependencyDetected = vi.fn()
      await expect(destroy({
        instances: [
          remoteConfigService,
          databaseService,
          userService,
          teamService,
        ],
        onCircularDependencyDetected,
      })).resolves.toBeUndefined()
      expect(onCircularDependencyDetected).not.toBeCalled()
      checkDispose()
    })

    it('should destroy instances with dependencies', {
      repeats: 10,
    }, async () => {
      const {
        remoteConfigService,
        databaseService,
        cacheService,
        userService,
        checkDispose,
      } = case1()
      const onCircularDependencyDetected = vi.fn()
      await expect(destroy({
        instances: [
          remoteConfigService,
          databaseService,
          cacheService,
          userService,
        ],
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
          group0.remoteConfigService,
          group0.databaseService,
          group0.userService,
          group0.teamService,
          group1.remoteConfigService,
          group1.databaseService,
          group1.cacheService,
          group1.userService,
        ],
        onCircularDependencyDetected,
      })).resolves.toBeUndefined()
      expect(onCircularDependencyDetected).not.toBeCalled()
      group0.checkDispose()
      group1.checkDispose()
    })

    function toNames(instances: unknown[]) {
      return instances.map(inst => (inst as object).constructor.name)
    }

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
      expect(toNames(stack)).toEqual(toNames([a, b, a]))
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
      expect(toNames(stack)).toEqual(toNames([a, c, b, a]))
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
        // A -> B -> C -> A; C -> D
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
        expect(dispose).toBeCalledTimes(7)
        expect(onCircularDependencyDetected).toHaveBeenCalled()
      },
    )
  })
})
