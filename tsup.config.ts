import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/graph/DiGraph.ts',
    'src/decorators/DependsOn.ts',
    'src/helpers/inversify/getDeps.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
})
