import { ValueType } from '../../index'
import { RangeCheck, TypeCheck } from '../../errors/index'
import { CycleResult, InternalValue, State, checkDictValue, checkStringValue } from '../../state/index'
import { ArrayLike } from '../../objects/Array'
import { checkIWritableDictionary } from '../../objects/dictionaries/index'

/* eslint-disable no-labels */

const setters: Record<string, (container: InternalValue, index: InternalValue, value: InternalValue) => InternalValue> = {
  [ValueType.string]: (container: InternalValue, index: InternalValue, value: InternalValue): InternalValue => {
    assert: checkStringValue(container)
    if (index.type !== ValueType.integer || value.type !== ValueType.integer) {
      throw new TypeCheck()
    }
    const pos = index.data
    if (pos < 0 || pos >= container.data.length) {
      throw new RangeCheck()
    }
    return {
      type: ValueType.string,
      data: [
        container.data.substring(0, pos),
        String.fromCharCode(value.data),
        container.data.substring(pos + 1)
      ].join('')
    }
  },

  [ValueType.array]: (container: InternalValue, index: InternalValue, value: InternalValue): InternalValue => {
    assert: ArrayLike.check(container.data)
    if (index.type !== ValueType.integer) {
      throw new TypeCheck()
    }
    const pos = index.data
    if (pos >= container.data.length) {
      throw new RangeCheck()
    }
    container.data.set(pos, value)
    return container
  },

  [ValueType.dict]: (container: InternalValue, index: InternalValue, value: InternalValue): InternalValue => {
    assert: checkDictValue(container)
    if (index.type !== ValueType.string) {
      throw new TypeCheck()
    }
    const name = index.data
    checkIWritableDictionary(container.data)
    container.data.def(name, value)
    return container
  }
}

export function set ({ operands }: State): CycleResult {
  const [value, index, container] = operands.check(null, null, null)
  const setter = setters[container.type]
  if (setter === undefined) {
    throw new TypeCheck()
  }
  operands.splice(3, setter(container, index, value))
  return null
}
