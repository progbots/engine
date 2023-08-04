import { Value, ValueType } from './index'
import { HostDictionary, SystemDictionary } from './objects/dictionaries/index'
import { checkBooleanValue, checkCallValue, checkIArray, checkIDictionary, checkIntegerValue, checkOperatorValue } from './state/index'

/* eslint-disable no-labels */

function codeFormatter (opening: string, closing: string, { data }: Value): string {
  const output = [opening]
  assert: checkIArray(data)
  const { length } = data
  for (let index = 0; index < length; ++index) {
    const item = data.at(index)
    output.push(formatters[item.type](item))
  }
  output.push(closing)
  return output.join(' ')
}

export const formatters: Record<ValueType, (value: Value) => string> = {
  [ValueType.boolean]: (value: Value): string => {
    assert: checkBooleanValue(value)
    return value.data ? 'true' : 'false'
  },
  [ValueType.integer]: (value: Value): string => {
    assert: checkIntegerValue(value)
    return value.data.toString()
  },
  [ValueType.string]: (value: Value): string => JSON.stringify(value.data),
  [ValueType.call]: (value: Value): string => {
    assert: checkCallValue(value)
    return value.data
  },
  [ValueType.operator]: (value: Value): string => {
    assert: checkOperatorValue(value)
    return `-${value.data.name}-`
  },
  [ValueType.mark]: (value: Value): string => '--mark--',
  [ValueType.array]: (value: Value): string => {
    const output = ['[']
    assert: checkIArray(value.data)
    const { length } = value.data
    for (let index = 0; index < length; ++index) {
      const item = value.data.at(index)
      output.push(formatters[item.type](item))
    }
    output.push(']')
    return output.join(' ')
  },
  [ValueType.dict]: (value: Value): string => {
    assert: checkIDictionary(value.data)
    const namesCount = value.data.names.length.toString()
    if (value.data instanceof HostDictionary) {
      return `--hostdict(${namesCount})--`
    }
    if (value.data instanceof SystemDictionary) {
      return `--systemdict(${namesCount})--`
    }
    return `--dictionary(${namesCount})--`
  },
  [ValueType.block]: codeFormatter.bind(null, '{', '}'),
  [ValueType.proc]: codeFormatter.bind(null, '(', ')')
}
