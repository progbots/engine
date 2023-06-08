import { ValueType, IDictionary } from '../../index'
import { RangeCheck, TypeCheck } from '../../errors/index'
import { InternalValue, State } from '../../state/index'
import { ArrayLike } from '../../objects/Array'
import { checkIWritableDictionary } from '../../objects/dictionaries/index'

const setters: Record<string, (container: InternalValue, index: InternalValue, value: InternalValue) => InternalValue> = {
  [ValueType.string]: (container: InternalValue, index: InternalValue, value: InternalValue): InternalValue => {
    if (index.type !== ValueType.integer || value.type !== ValueType.integer) {
      throw new TypeCheck()
    }
    const pos = index.data
    const string = container.data as string
    if (pos < 0 || pos >= string.length) {
      throw new RangeCheck()
    }
    return {
      type: ValueType.string,
      data: [
        string.substring(0, pos),
        String.fromCharCode(value.data),
        string.substring(pos + 1)
      ].join('')
    }
  },

  [ValueType.array]: (container: InternalValue, index: InternalValue, value: InternalValue): InternalValue => {
    if (index.type !== ValueType.integer) {
      throw new TypeCheck()
    }
    const pos = index.data
    const array = container.data as ArrayLike
    if (pos >= array.length) {
      throw new RangeCheck()
    }
    array.set(pos, value)
    return container
  },

  [ValueType.dict]: (container: InternalValue, index: InternalValue, value: InternalValue): InternalValue => {
    if (index.type !== ValueType.string) {
      throw new TypeCheck()
    }
    const name = index.data
    const iDict = container.data as IDictionary
    checkIWritableDictionary(iDict)
    iDict.def(name, value)
    return container
  }
}

export function * set ({ operands }: State): Generator {
  const [value, index, container] = operands.check(null, null, null)
  const setter = setters[container.type]
  if (setter === undefined) {
    throw new TypeCheck()
  }
  operands.splice(3, setter(container, index, value))
}
