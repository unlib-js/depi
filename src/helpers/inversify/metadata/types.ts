export const enum InjectionKind {
  MULTI,
  SINGLE,
  UNMANAGED,
}

export type PropertyInjectionMetadata = [string | symbol, InjectionKind][]
export type ParameterInejectionMetadata = [number, InjectionKind][]

export interface MetadataReader {
  getPropertiesMetadata(ctor: NewableFunction): PropertyInjectionMetadata
  getConstructorMetadata(ctor: NewableFunction): ParameterInejectionMetadata
}
