import { IArray, IState, Value, ValueType } from '..'
import { InternalValue } from '../state'
import { blue, red, white, yellow } from './colors'
import { formatters } from './formatters'
import { parse } from '../state/parser'

const MAX_LENGTH = 80
const unexpected = (value: Value): string => `${red}unexpected stack item type ${value.type}${white}`

export const renderers: Record<ValueType, (value: Value, step: number | undefined) => string> = {
  [ValueType.boolean]: unexpected,
  [ValueType.integer]: unexpected,
  [ValueType.string]: (value: Value, step: number | undefined): string => {
    const base = value.data as string
    if (base.length > MAX_LENGTH || base.includes('\n')) {
      // TODO
      return `${red}--unprocessable string--${white}`
    }
    if (step !== undefined) {
      const before = base.substring(0, step)
      const parser = parse(base.substring(step))
      const { value } = parser.next()
      const keyword = value.data as string
      const after = base.substring(step + keyword.length)
      return `${before}${yellow}${keyword}${white}${after}`
    }
    return base
  },
  [ValueType.name]: unexpected,
  [ValueType.call]: (value: Value): string => formatters[value.type](value),
  [ValueType.operator]: (value: Value, step: number | undefined): string => {
    const base = formatters[value.type](value)
    if (step !== undefined) {
      return `${base}:${step}`
    }
    return base
  },
  [ValueType.mark]: unexpected,
  [ValueType.array]: unexpected,
  [ValueType.dict]: unexpected,
  [ValueType.proc]: (value: Value, step: number | undefined): string => {
    const output = ['{']
    const array: IArray = value.data as IArray
    const { length } = array
    for (let index = 0; index < length; ++index) {
      const item = array.at(index)
      if (step === index) {
        output.push(yellow + formatters[item.type](item) + white)
      } else {
        output.push(formatters[item.type](item))
      }
    }
    output.push('}')
    return output.join(' ')
  }
}

export function renderCallStack (state: IState): void {
  const calls = state.calls
  const { length } = calls
  let step: number | undefined
  for (let index = 0; index < length; ++index) {
    const value = calls.at(index)
    if (value.type === ValueType.integer) {
      step = value.data as number
      continue
    }
    let debugInfo = ''
    const { sourceFile, sourcePos } = value as InternalValue
    if (sourceFile !== undefined && sourcePos !== undefined) {
      debugInfo = `${blue}@${sourceFile}(${sourcePos.toString()})${white}`
    }
    const renderer = renderers[value.type]
    if (renderer === undefined) {
      console.log(`${red}unexpected stack item type ${value.type}${white}`)
    }
    const rendered = renderer(value, step)
    console.log(rendered, debugInfo)
    step = undefined
  }
}
