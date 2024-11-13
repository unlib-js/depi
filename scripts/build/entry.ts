import path from 'path/posix'

export const srcPrefix = './src/'

export const mods = [
  'index',
  'graph/DiGraph',
  'decorators/DependsOn',
  'decorators/Dependency',
  'helpers/inversify/getDeps',
  'dependency/types',
  'dependency/depsOf',
  'dependency/DependencyGraphBuilder',
  'dependency/FullDependencyGraphBuilder',
]

const entry = mods
  .map(mod => path.join(srcPrefix, `${mod}.ts`))

export default entry
