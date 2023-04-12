import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { cyan, green, red, white, yellow } from './colors'
import { hostDictionary } from './host'
import { createState } from '../factory'
import { ExitError } from './host/exit'
import { BaseError } from '../errors/BaseError'
import { reset, increment } from './cycle'
import { status } from './status'

async function main (): Promise<void> {
  const debug = process.argv.includes('--debug')
  if (debug) {
    console.log(`${green}DEBUG mode enabled${white}`)
  }
  const rl = readline.createInterface({ input, output })
  console.log(`${cyan}Use '${yellow}exit${cyan}' to quit
Use '${yellow}state${cyan}' to print a state summary${white}`)

  const state = createState({
    hostDictionary,
    keepDebugInfo: debug
  })
  let replIndex = 0

  while (true) {
    const src = await rl.question('? ')
    try {
      const lastUsedMemory = state.usedMemory
      reset()
      const iterator = state.parse(src, `repl${replIndex++}`)
      let { done } = iterator.next()
      while (done === false) {
        increment()
        done = iterator.next().done
      }
      status(state, {
        lastUsedMemory
      })
    } catch (e) {
      if (e instanceof ExitError) {
        break
      } else if (e instanceof BaseError) {
        console.error(`${red}/!\\ ${e.name}: ${e.message}\n${e.callstack}${white}`)
      } else {
        console.error(e)
        break
      }
    }
  }

  rl.close()
}

main()
  .catch(reason => console.error(reason))
