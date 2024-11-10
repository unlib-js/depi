export const enum MetaKey {
  DependsOnProps = 'depends-on-props',
}

const symDeps: unique symbol = Symbol.for('ctorDeps')

export const symbols = {
  ctorDeps: symDeps,
} as const
