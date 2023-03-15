import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { State } from './state'
import { BaseError } from './errors/BaseError'
import { SystemDictionary } from './dictionaries'
import { length as itLength } from './iterators'

async function main (): Promise<void> {
  const rl = readline.createInterface({ input, output })
  console.log('Use \'exit\' to quit')
  console.log('Use \'state\' to print a state summary')
  const state = new State()

  while (true) {
    const src = await rl.question(`${state.stackRef().length}> `)
    if (src === 'exit') {
      break
    }
    if (src === 'state') {
      const { used, total } = state.memory()
      console.log('Memory :', used, '/', total)
      console.log('Dictionaries :', itLength(state.dictionaries()))
      let index = 0
      for (const dictionary of state.dictionaries()) {
        let type = ''
        if (dictionary instanceof SystemDictionary) {
          type = 'system'
        }
        const keys = dictionary.keys()
        console.log(index, ''.padEnd(3 - index.toString().length, ' '), `(${type})`, keys.length)
        ++index
      }
      console.log('Stack :', state.stackRef().length)
      state.stackRef().forEach(({ type, data }, index) => {
        console.log(index, ''.padEnd(3 - index.toString().length, ' '), `(${type})`, data)
      })
    } else {
      try {
        const count = itLength(state.eval(src))
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
