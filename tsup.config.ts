import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/graph/DiGraph.ts',
    'src/decorators/DependsOn.ts',
    'src/decorators/Dependency.ts',
    'src/helpers/inversify/getDeps.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  external: ['reflect-metadata', 'inversify'],
})
