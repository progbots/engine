import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { State } from './state'
import { parse } from './parser'
import { BaseError } from './errors/BaseError'

async function main (): Promise<void> {
  const rl = readline.createInterface({ input, output })
  console.log('Use .exit to quit')
  console.log('Use .pstack to show state')
  const state = new State()

  while (true) {
    const src = await rl.question(`${state.stack().length}> `)
    if (src === '.exit') {
      break
    }
    if (src === '.pstack') {
      console.log(`Contexts count : ${state.contexts().length}`)
      const reversedStack = [...state.stack()].reverse()
      reversedStack.forEach((value, index) => {
        console.log(`[${reversedStack.length - index - 1}] ${value.type} ${value.data.toString()}`)
      })
    } else {
      try {
        parse(src, state).forEach(value => state.eval(value))
      } catch (e) {
        if (e instanceof BaseError) {
          console.log(`-${e.name}- ${e.message}`)
        } else {
          console.error(e)
          break
        }
      }
    }
  }

  rl.close()
}

main()
  .catch(reason => console.error(reason))
