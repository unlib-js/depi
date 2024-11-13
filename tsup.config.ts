import { defineConfig } from 'tsup'
import entry from './scripts/build/entry'

export default defineConfig({
  entry,
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  external: ['reflect-metadata', 'inversify'],
})
