import { inject, injectable } from 'inversify'
import { describe, expect, it } from 'vitest'
import getDeps from './getDeps'

describe('getDeps', () => {
  it(
    'should return empty dependencies for ' +
    'a class without dependencies',
    () => {
      @injectable()
      class Whatever {}
      const { params, props } = getDeps(Whatever)
      expect(params(Whatever)).toEqual([])
      expect(props).toEqual([])
    },
  )

  it(
    'should return indexes of constructor parameters ' +
    'annotated by @inject',
    () => {
      @injectable()
      class Whatever {
        public constructor(
          @inject('Foo') foo: unknown,
          @inject('Bar') public bar: unknown,
          nope: unknown,
          @inject('Baz') baz: unknown,
          yep: unknown,
        ) {
          void foo
          void nope
          void baz
          void yep
        }
      }
      const { params, props } = getDeps(Whatever)
      expect(params(Whatever)).toEqual([0, 1, 3])
      expect(props).toEqual([])
    },
  )

  it('should return keys of properties annotated by @inject', () => {
    @injectable()
    class Whatever {
      @inject('Foo') public foo?: unknown
      @inject('Bar') protected bar?: unknown
      @inject('Baz') private baz?: unknown
      public constructor() {
        void this.baz
      }
    }
    const { params, props } = getDeps(Whatever)
    expect(params(Whatever)).toEqual([])
    expect(props).toEqual(['foo', 'bar', 'baz'])
  })

  it('should return both parameter and property dependencies', () => {
    @injectable()
    class Whatever {
      @inject('Foo') public prop0?: unknown
      @inject('Bar') protected prop1?: unknown
      @inject('Baz') private prop2?: unknown
      public prop3?: unknown
      public constructor(
        @inject('Qux') param0: unknown,
        public param1?: unknown,
        @inject('Quuz') private param2?: unknown,
        param3?: unknown,
      ) {
        void this.prop2
        void param0
        void this.param2
        void param3
      }
    }
    const { params, props } = getDeps(Whatever)
    expect(params(Whatever)).toEqual([0, 2])
    expect(props).toEqual(['prop0', 'prop1', 'prop2'])
  })
})
