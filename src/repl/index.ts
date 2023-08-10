import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { readSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { main } from './impl'
import { IReplHost } from './replHost'

const rl = readline.createInterface({ input, output })

const replHost: IReplHost = {
  output (text) {
    console.log(text + '\x1b[37m')
  },

  async getInput () {
    return await rl.question('? ')
  },

  async getChar () {
    const buffer = Buffer.alloc(1)
    readSync(0, buffer, 0, 1, null)
    return buffer.toString('utf8')
  },

  getSample (name: string) {
    return readFileSync(join('docs/samples', name)).toString()
  }
}

main(replHost, process.argv.includes('--debug'))
  .then(() => process.exit())
  .catch(reason => console.error(reason))
