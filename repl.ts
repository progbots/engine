import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { cycles, State } from './state'
import { BaseError } from './errors/BaseError'
import { SystemDictionary } from './dictionaries'

async function main (): Promise<void> {
  const rl = readline.createInterface({ input, output })
  console.log('Use \'exit\' to quit')
  console.log('Use \'state\' to print a state summary')
  const state = new State()

  while (true) {
    const src = await rl.question(`${state.stack().length}> `)
    if (src === 'exit') {
      break
    }
    if (src === 'state') {
      const { used, total } = state.memory()
      console.log('Memory :', used, '/', total)
      console.log('Dictionaries :', state.dictionaries().length)
      state.dictionaries().forEach((dictionary, index) => {
        let type = ''
        if (dictionary instanceof SystemDictionary) {
          type = 'system'
        }
        const keys = dictionary.keys()
        console.log(index, ''.padEnd(3 - index.toString().length, ' '), `(${type})`, keys.length)
      })
      console.log('Stack :', state.stack().length)
      state.stack().forEach(({ type, data }, index) => {
        console.log(index, ''.padEnd(3 - index.toString().length, ' '), `(${type})`, data)
      })
    } else {
      try {
        const count = cycles(state.eval(src))
        const { used, total } = state.memory()
        console.log('Cycles :', count, 'Memory :', used, '/', total)
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
