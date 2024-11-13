export const enum MetaKey {
  DependsOnProps = 'depends-on-props',
}

export interface Symbols {
  readonly ctorDeps: unique symbol
}

export const symbols = {
  ctorDeps: Symbol.for('ctorDeps'),
} as Symbols
