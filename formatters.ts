import { IArray, IDictionary, IOperator, Value, ValueType } from '.'
import { HostDictionary, SystemDictionary } from './objects/dictionaries'

export const formatters: Record<ValueType, (value: Value) => string> = {
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
