import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { BaseError } from './errors/BaseError'
import { HostDictionary, SystemDictionary } from './objects/dictionaries'
import { length as itLength } from './iterators'
import { Value, ValueType, IOperator, IArray, IDictionary, IState } from '.'
import { createState } from './factory'
import { InternalValue, OperatorFunction, State } from './state'
import { checkOperands } from './operators/operands'
import { readFileSync } from 'fs'

const black = '\x1b[30m'
const red = '\x1b[31m'
const green = '\x1b[32m'
const yellow = '\x1b[33m'
const blue = '\x1b[34m'
// const magenta = '\x1b[35m'
// const cyan = '\x1b[36m'
const white = '\x1b[37m'

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
    const dict = value.data as IDictionary
    if (value.data instanceof HostDictionary) {
      return `--hostdict(${dict.names.length.toString()})--`
    }
    if (value.data instanceof SystemDictionary) {
      return `--systemdict(${dict.names.length.toString()})--`
    }
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
    return scaleBytes(used) + black + '/∞' + white
  }
  return scaleBytes(used) + black + '/' + scaleBytes(total) + white
}

function forEach (array: IArray, callback: (value: Value, formattedIndex: string) => void): void {
  const { length } = array
  let width = 1
  if (length > 10) {
    ++width
  }
  if (length > 100) {
    ++width
  }
  for (let index = 0; index < length; ++index) {
    const formattedIndex = `${black}${index.toString().padStart(width, ' ')}${white}`
    callback(array.at(index), formattedIndex)
  }
}

class ExitError extends Error {}

const hostMethods: Record<string, OperatorFunction> = {
  exit: function * (state: State): Generator {
    throw new ExitError()
  },

  state: function * (state: State): Generator {
    const dictLength = state.dictionaries.length
    console.log(`${blue}memory: ${yellow}${memory(state)}
${blue}dictionaries: ${yellow}${dictLength}${white}`)
    forEach(state.dictionaries, (value, formattedIndex) => {
      console.log(formattedIndex, formatters[value.type](value))
    })
    console.log(`${blue}operands: ${yellow}${state.operands.length}${white}`)
    forEach(state.operands, (value, formattedIndex) => {
      let debugInfo
      const { sourceFile, sourcePos } = value as InternalValue
      if (sourceFile === undefined || sourcePos === undefined) {
        debugInfo = ''
      } else {
        debugInfo = `${black}@${sourceFile}(${sourcePos.toString()})${white}`
      }
      console.log(formattedIndex, formatters[value.type](value), debugInfo)
    })
  },

  load: function * (state: State): Generator {
    const [path] = checkOperands(state, ValueType.string).map(value => value.data as string)
    state.pop()
    const source = readFileSync(path).toString()
    yield * state.innerParse(source, path)
  }
}

const hostDictionary = {
  get names () {
    return Object.keys(hostMethods)
  },

  lookup (name: string): Value | null {
    const operator = hostMethods[name]
    if (operator === undefined) {
      return null
    }
    return {
      type: ValueType.operator,
      data: operator
    }
  }
}

async function main (): Promise<void> {
  const debug = process.argv.includes('--debug')
  if (debug) {
    console.log(`${green}DEBUG mode enabled${white}`)
  }
  const rl = readline.createInterface({ input, output })
  console.log(`${black}Use '${yellow}exit${black}' to quit
Use '${yellow}state${black}' to print a state summary${white}`)
  const state = createState({
    hostDictionary,
    keepDebugInfo: debug
  })
  let index = 0
  while (true) {
    const src = await rl.question('? ')
    try {
      const cycles = itLength(state.parse(src, `repl${index++}`))
      console.log(`${blue}cycles: ${yellow}${cycles}${blue}, operands: ${yellow}${state.operands.length}${blue}, memory: ${yellow}${memory(state)}${white}`)
    } catch (e) {
      if (e instanceof ExitError) {
        break
      } else if (e instanceof BaseError) {
        console.error(`${red}/!\\ ${e.name} ${e.message}${white}`)
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
