import { readFile, writeFile } from 'fs/promises'
import entry from './entry'

async function main() {
  const typedocJson = JSON.parse(await readFile('typedoc.json', 'utf-8'))
  typedocJson.entryPoints = entry
  await writeFile('typedoc.json', JSON.stringify(typedocJson, null, 2) + '\n')
}

await main()

export default null
