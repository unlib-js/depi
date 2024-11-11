import { MetaKey } from '@/common'
import { describe, expect, it } from 'vitest'
import Dependency from './Dependency'

describe('Dependency', () => {
  it('should add property to metadata when decorator is applied', () => {
    class TestClass {
      @Dependency()
      public testProp = 'test-dep'
    }

    const metadata = Reflect.getMetadata(MetaKey.DependsOnProps, TestClass)
    expect(metadata).toEqual(['testProp'])
  })

  it('should append multiple decorated properties to metadata', () => {
    class TestClass {
      @Dependency()
      public prop1 = 'dep1'

      @Dependency()
      protected prop2 = 'dep2'

      @Dependency()
      private prop3 = 'dep3'

      public constructor() {
        void this.prop3
      }
    }

    const metadata = Reflect.getMetadata(MetaKey.DependsOnProps, TestClass)
    expect(metadata).toEqual(['prop1', 'prop2', 'prop3'])
  })

  it('should handle symbol properties', () => {
    const testSymbol = Symbol('test')

    class TestClass {
      @Dependency()
      public [testSymbol] = 'sym-dep'
    }

    const metadata = Reflect.getMetadata(MetaKey.DependsOnProps, TestClass)
    expect(metadata).toEqual([testSymbol])
  })

  it('should preserve existing metadata when adding new dependencies', () => {
    class TestClass {
      @Dependency()
      public prop1 = 'dep1'
    }

    class TestClass2 extends TestClass {
      @Dependency()
      public prop2 = 'dep2'
    }

    const metadata = Reflect.getMetadata(MetaKey.DependsOnProps, TestClass2)
    expect(metadata).toEqual(['prop1', 'prop2'])
  })
})
