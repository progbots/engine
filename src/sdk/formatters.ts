import {
  Value,
  ValueType,
  checkBooleanValue,
  checkIntegerValue,
  checkStringValue,
  checkBlockValue,
  checkCallValue,
  checkOperatorValue,
  checkArrayValue,
  checkDictionaryValue,
  IArray
} from '@api'
import { DICT_TYPE_INTERNAL_NAME, EXTERNAL_TYPE } from '@objects/dictionaries/dict-type'

function formatArray (array: IArray, begin: string, end: string): string {
  const output = [begin]
  const { length } = array
  for (let index = 0; index < length; ++index) {
    const item = array.at(index)
    if (item === null) {
      output.push('␀')
    } else {
      output.push(formatters[item.type](item))
    }
  }
  output.push(end)
  return output.join(' ')
}

export const formatters: Record<ValueType, (value: Value) => string> = {
  [ValueType.boolean]: (value: Value): string => {
    checkBooleanValue(value)
    return value.isSet ? 'true' : 'false'
  },
  [ValueType.integer]: (value: Value): string => {
    checkIntegerValue(value)
    return value.number.toString()
  },
  [ValueType.string]: (value: Value): string => {
    checkStringValue(value)
    return JSON.stringify(value.string)
  },
  [ValueType.mark]: (value: Value): string => '--mark--',
  [ValueType.block]: (value: Value): string => {
    checkBlockValue(value)
    return formatArray(value.block, '{', '}')
  },
  [ValueType.call]: (value: Value): string => {
    checkCallValue(value)
    return value.call
  },
  [ValueType.operator]: (value: Value): string => {
    checkOperatorValue(value)
    return `-${value.operator.name}-`
  },
  [ValueType.array]: (value: Value): string => {
    checkArrayValue(value)
    return formatArray(value.array, '[', ']')
  },
  [ValueType.dictionary]: (value: Value): string => {
    checkDictionaryValue(value)
    const namesCount = value.dictionary.names.length.toString()
    const dictName = value.dictionary.lookup(DICT_TYPE_INTERNAL_NAME) ?? { type: ValueType.string, string: EXTERNAL_TYPE }
    checkStringValue(dictName)
    return `--${dictName.string}(${namesCount})--`
  }
}
