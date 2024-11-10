export const enum MetaKey {
  DependsOnProps = 'depends-on-props',
}

const symCtorDeps: unique symbol = Symbol.for('ctorDeps')

export const symbols = {
  ctorDeps: symCtorDeps,
} as const
