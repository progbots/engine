import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { State } from './state'
import { parse } from './parser'

async function main (): Promise<void> {
  const rl = readline.createInterface({ input, output })
  console.log('Use exit to quit')
  const state = new State()

  while (true) {
    const src = await rl.question('> ')
    if (src === 'exit') {
      break
    }
    const block = parse(src, state)
    console.log(block)
  }

  rl.close()
}

main()
  .catch(reason => console.error(reason))
