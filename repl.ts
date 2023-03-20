import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { BaseError } from './errors/BaseError'
import { SystemDictionary } from './objects/dictionaries'
import { length as itLength } from './iterators'
import { Value, ValueType, IOperator, IArray, IDictionary, IState } from '.'
import { createState } from './factory'

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
    yield (value.data as IOperator).name
  } else if (value.type === ValueType.mark) {
    yield ''
  } else if (value.type === ValueType.array) {
    yield '['
    const array: IArray = value.data as IArray
    const { length } = array
    for (let index = 0; index < length; ++index) {
      yield * fmt(array.at(index))
    }
    yield ']'
  } else if (value.type === ValueType.dict) {
    if (value.data instanceof SystemDictionary) {
      yield '-systemdict-'
    } else {
      yield '// not handled //'
    }
  }
}

function * memory (state: IState): Generator<number | string> {
  yield '💾'
  yield state.usedMemory
  const total = state.totalMemory
  if (total === Infinity) {
    yield '/∞'
  } else {
    yield '/'
    yield total
  }
}

function forEach (array: IArray, callback: (value: Value, index: number) => void): void {
  const { length } = array
  for (let index = 0; index < length; ++index) {
    callback(array.at(index), index)
  }
}

async function main (): Promise<void> {
  const rl = readline.createInterface({ input, output })
  console.log('Use \'exit\' to quit')
  console.log('Use \'state\' to print a state summary')
  const state = createState()

  while (true) {
    const src = await rl.question('❔ ')
    if (src === 'exit') {
      break
    }
    if (src === 'state') {
      console.log(...memory(state))
      forEach(state.dictionaries, (value, index) => {
        const dictionary = value.data as IDictionary
        let type = ''
        if (dictionary instanceof SystemDictionary) {
          type = '🔩'
        }
        const { keys } = dictionary
        console.log('📕', index, ''.padEnd(3 - index.toString().length, ' '), type, '🔑', keys.length)
      })
      forEach(state.stack, (value, index) => {
        console.log('📥', index, ''.padEnd(3 - index.toString().length, ' '), types[value.type], ...fmt(value))
      })
    } else {
      try {
        const count = itLength(state.eval(src))
        console.log('↻', count, '📥', state.stack.length, ...memory(state))
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
