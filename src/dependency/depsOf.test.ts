import DependsOn from '@/decorators/DependsOn'
import { describe, expect, it } from 'vitest'
import depsOf from './depsOf'
import { mkParamDep, propDepFrom } from './testUtils'

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
    expect(props).toEqual([propDepFrom(aObj, 'foo'), propDepFrom(aObj, 'baz')])
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
    expect(params).toEqual([mkParamDep(0, 'foo'), mkParamDep(2, 'baz')])
  })

  it(
    'should retrieve both property and parameter dependencies correctly',
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
      expect(params)
        .toEqual([mkParamDep(0, 'param-val-0'), mkParamDep(2, 'param-val-2')])
      expect(props)
        .toEqual([propDepFrom(aObj, 'prop0'), propDepFrom(aObj, 'prop2')])
    },
  )
})
