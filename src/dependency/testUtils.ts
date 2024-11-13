import type {
  RuntimeCtorParamDependency,
  RuntimePropDependency,
} from './types'

export function propDepFrom<T>(obj: T, prop: keyof T) {
  const value = obj[prop]
  return { value, prop } satisfies RuntimePropDependency
}

export function mkParamDep(param: number, value: unknown) {
  return { param, value } satisfies RuntimeCtorParamDependency
}
