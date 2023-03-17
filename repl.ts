import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { State } from './state'
import { BaseError } from './errors/BaseError'
import { SystemDictionary } from './objects/dictionaries'
import { length as itLength } from './iterators'
import { OperatorFunction, Value, ValueType } from './types'

const types: Record<ValueType, string> = {
  [ValueType.integer]: 'Z', // R
  [ValueType.string]: '🖹',
  [ValueType.name]: '🏷️',
  [ValueType.call]: '⚡',
  [ValueType.operator]: '🔩',
  [ValueType.mark]: '🚩',
  [ValueType.array]: '📦',
  [ValueType.dict]: '📕'
}

function * fmt (value: Value): Generator<number | string> {
  if (value.type === ValueType.integer) {
    yield value.data as number
  } else if ([ValueType.string, ValueType.name, ValueType.call].includes(value.type)) {
    yield value.data as string
  } else if (value.type === ValueType.operator) {
    yield (value.data as OperatorFunction).name
  } else if (value.type === ValueType.mark) {
    yield ''
  }
}

function * memory (state: State): Generator<number | string> {
  const { used, total } = state.memory()
  yield '💾'
  yield used
  if (total === Infinity) {
    yield '/∞'
  } else {
    yield '/'
    yield total
  }
}

async function main (): Promise<void> {
  const rl = readline.createInterface({ input, output })
  console.log('Use \'exit\' to quit')
  console.log('Use \'state\' to print a state summary')
  const state = new State()

  while (true) {
    const src = await rl.question('❔ ')
    if (src === 'exit') {
      break
    }
    if (src === 'state') {
      console.log(...memory(state))
      let index = 0
      for (const dictionary of state.dictionaries()) {
        let type = ''
        if (dictionary instanceof SystemDictionary) {
          type = '🔩'
        }
        const keys = dictionary.keys()
        console.log('📕', index, ''.padEnd(3 - index.toString().length, ' '), type, '🔑', keys.length)
        ++index
      }
      state.stackRef().forEach((value, index) => {
        console.log('📥', index, ''.padEnd(3 - index.toString().length, ' '), types[value.type], ...fmt(value))
      })
    } else {
      try {
        const count = itLength(state.eval(src))
        console.log('↻', count, '📥', state.stackRef().length, ...memory(state))
      } catch (e) {
        if (e instanceof BaseError) {
          console.error(`🛑 ${e.name} ${e.message}`)
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
