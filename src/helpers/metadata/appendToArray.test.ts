import { describe, expect, it } from 'vitest'
import appendToArray from './appendToArray'

const testKey = 'testKey'

describe('appendToArray', () => {
  it('should create new metadata array when none exists', () => {
    const target = {}
    appendToArray(testKey, ['testValue'], target)

    expect(Reflect.getMetadata(testKey, target)).toEqual(['testValue'])
  })

  it('should append to existing metadata array', () => {
    const target = {}

    appendToArray(testKey, [0], target)
    appendToArray(testKey, [1, 2], target)

    expect(Reflect.getMetadata(testKey, target)).toEqual([0, 1, 2])
  })

  it('should use inherited metadata array when appending', () => {
    class A {}
    class B extends A{}

    appendToArray(testKey, [0], A)
    appendToArray(testKey, [1, 2], B)

    expect(Reflect.getMetadata(testKey, A)).toEqual([0])
    expect(Reflect.getMetadata(testKey, B)).toEqual([0, 1, 2])
  })
})
