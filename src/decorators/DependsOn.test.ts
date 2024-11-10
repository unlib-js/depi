import { MetaKey, symbols } from '@/common'
import { Dependant } from '@/types'
import { describe, expect, it } from 'vitest'
import DependsOn from './DependsOn'

describe('DependsOn', () => {
  it('should add metadata to the class correctly', () => {
    @DependsOn(['foo', 'bar'])
    class A {
      public foo: unknown
      public bar: unknown
    }
    expect(Reflect.getMetadata(MetaKey.DependsOn, A)).toEqual(['foo', 'bar'])
  })

  it('should add metadata to inherited class correctly', () => {
    @DependsOn(['foo', 'bar'])
    class A {
      public foo: unknown
      public bar: unknown
    }

    class B extends A {}

    expect(Reflect.getMetadata(MetaKey.DependsOn, B)).toEqual(['foo', 'bar'])


    @DependsOn([])
    class C extends B {}

    expect(Reflect.getMetadata(MetaKey.DependsOn, C)).toEqual(['foo', 'bar'])


    @DependsOn(['baz'])
    class D extends C {
      public baz: unknown
    }

    expect(Reflect.getMetadata(MetaKey.DependsOn, D))
      .toEqual(['foo', 'bar', 'baz'])
  })

  it('should return a wrapped class with the correct name', () => {
    @DependsOn(['foo', 'bar'])
    class A {
      public foo: unknown
      public bar: unknown
    }
    expect(A.name).toBe('A')
  })

  it('should capture the constructor parameters correctly', () => {
    @DependsOn({
      params: [0, 2],
    })
    class A {
      public foo: unknown
      public bar: unknown
      public constructor(
        foo: unknown,
        bar: unknown,
        baz: unknown,
        qux: unknown,
      ) {
        void foo
        void bar
        void baz
        void qux
      }
    }
    const aObj = new A('foo', 'bar', 'baz', 'qux') as unknown as Dependant
    expect(aObj[symbols.ctorDeps]).toEqual(['foo', 'baz'])
  })
})
