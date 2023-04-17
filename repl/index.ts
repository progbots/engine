import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { readSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { blue, cyan, green, magenta, red, white, yellow } from './colors'
import { main } from './impl'
import { IReplHost } from './replHost'

const rl = readline.createInterface({ input, output })

const replHost: IReplHost = {
  output (text) {
    console.log(text
      .replaceAll(red, '\x1b[31m')
      .replaceAll(green, '\x1b[32m')
      .replaceAll(yellow, '\x1b[33m')
      .replaceAll(blue, '\x1b[34m')
      .replaceAll(magenta, '\x1b[35m')
      .replaceAll(cyan, '\x1b[36m')
      .replaceAll(white, '\x1b[37m') +
      '\x1b[37m'
    )
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
