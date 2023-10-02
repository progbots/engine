import {
  Value,
  ValueType,
  checkStringValue,
  IArray
} from '@api'
import { DICT_TYPE_INTERNAL_NAME, EXTERNAL_TYPE } from '@objects/dictionaries/dict-type'

function arrayImplementation (array: IArray, begin: string, end: string): string {
  const output = [begin]
  const { length } = array
  for (let index = 0; index < length; ++index) {
    const item = array.at(index)
    if (item === null) {
      output.push('␀')
    } else {
      output.push(implementations[item.type](item as never))
    }
  }
  output.push(end)
  return output.join(' ')
}

const implementations: { [type in ValueType]: (container: Value<type>) => string } = {
  [ValueType.boolean]: ({ isSet }) => isSet ? 'true' : 'false',
  [ValueType.integer]: ({ number }) => number.toString(),
  [ValueType.string]: ({ string }) => JSON.stringify(string),
  [ValueType.mark]: () => '--mark--',
  [ValueType.block]: ({ block }) => arrayImplementation(block, '{', '}'),
  [ValueType.call]: ({ call }) => call,
  [ValueType.operator]: ({ operator }) => `-${operator.name}-`,
  [ValueType.array]: ({ array }) => arrayImplementation(array, '[', ']'),
  [ValueType.dictionary]: ({ dictionary }) => {
    const namesCount = dictionary.names.length.toString()
    const dictName = dictionary.lookup(DICT_TYPE_INTERNAL_NAME) ?? { type: ValueType.string, string: EXTERNAL_TYPE }
    checkStringValue(dictName)
    return `--${dictName.string}(${namesCount})--`
  }
}

export function toString (value: Value): string {
  return implementations[value.type](value as never)
}
