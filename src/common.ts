export const enum MetaKey {
  DependsOn = 'depends-on',
}

const symDeps: unique symbol = Symbol.for('ctorDeps')

export const symbols = {
  ctorDeps: symDeps,
} as const
