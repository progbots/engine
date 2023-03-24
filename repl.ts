import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { BaseError } from './errors/BaseError'
import { SystemDictionary } from './objects/dictionaries'
import { length as itLength } from './iterators'
import { Value, ValueType, IOperator, IArray, IDictionary, IState } from '.'
import { createState } from './factory'

const formatters: Record<ValueType, (value: Value) => string> = {
  [ValueType.boolean]: (value: Value): string => value.data as boolean ? 'true' : 'false',
  [ValueType.integer]: (value: Value): string => (value.data as number).toString(),
  [ValueType.string]: (value: Value): string => JSON.stringify(value.data as string),
  [ValueType.name]: (value: Value): string => `/${value.data as string}`,
  [ValueType.call]: (value: Value): string => value.data as string,
  [ValueType.operator]: (value: Value): string => `-${(value.data as IOperator).name}-`,
  [ValueType.mark]: (value: Value): string => '--mark--',
  [ValueType.array]: (value: Value): string => {
    const output = ['[']
    const array: IArray = value.data as IArray
    const { length } = array
    for (let index = 0; index < length; ++index) {
      const item = array.at(index)
      output.push(formatters[item.type](item))
    }
    output.push(']')
    return output.join(' ')
  },
  [ValueType.dict]: (value: Value): string => {
    if (value.data instanceof SystemDictionary) {
      return '--systemdict--'
    }
    const dict = value.data as IDictionary
    return `--dictionary(${dict.names.length.toString()})--`
  },
  [ValueType.proc]: (value: Value): string => {
    const output = ['{']
    const array: IArray = value.data as IArray
    const { length } = array
    for (let index = 0; index < length; ++index) {
      const item = array.at(index)
      output.push(formatters[item.type](item))
    }
    output.push('}')
    return output.join(' ')
  }
}

const bytesScales: Array<{
  factor: number
  unit: string
}> = [{
  factor: 1024 * 1024,
  unit: 'MB'
}, {
  factor: 1024,
  unit: 'kB'
}]

function scaleBytes (bytes: number): string {
  for (const scale of bytesScales) {
    if (bytes > scale.factor) {
      return `${(bytes / scale.factor).toFixed(2)}${scale.unit}`
    }
  }
  return `${bytes}B`
}

function memory (state: IState): string {
  const { usedMemory: used, totalMemory: total } = state
  if (total === Infinity) {
    return scaleBytes(used) + '/∞'
  }
  return scaleBytes(used) + '/' + scaleBytes(total)
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
    const src = await rl.question('? ')
    if (src === 'exit') {
      break
    }
    if (src === 'state') {
      console.log(`memory: ${memory(state)}`)
      console.log(`dictionaries: ${state.dictionaries.length}`)
      forEach(state.dictionaries, (value, index) => {
        console.log(index, ''.padEnd(3 - index.toString().length, ' '), formatters[value.type](value))
      })
      console.log(`stack: ${state.stack.length}`)
      forEach(state.stack, (value, index) => {
        console.log(index, ''.padEnd(3 - index.toString().length, ' '), formatters[value.type](value))
      })
    } else {
      try {
        const cycles = itLength(state.parse(src))
        console.log(`cycles: ${cycles}, stack: ${state.stack.length}, memory: ${memory(state)}`)
      } catch (e) {
        if (e instanceof BaseError) {
          console.error(`/!\\ ${e.name} ${e.message}`)
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
