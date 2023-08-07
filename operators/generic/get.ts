import { ValueType } from '../../index'
import { RangeCheck, TypeCheck, Undefined } from '../../errors/index'
import { CycleResult, InternalValue, State, checkDictValue, checkStringValue } from '../../state/index'
import { ArrayLike } from '../../objects/Array'

/* eslint-disable no-labels */

function arrayLikeGetter (container: InternalValue, index: InternalValue): InternalValue {
  assert: ArrayLike.check(container.data)
  if (index.type !== ValueType.integer) {
    throw new TypeCheck()
  }
  const pos = index.data
  return container.data.at(pos)
}

const getters: Record<string, (container: InternalValue, index: InternalValue) => InternalValue> = {
  [ValueType.string]: (container: InternalValue, index: InternalValue): InternalValue => {
    assert: checkStringValue(container)
    if (index.type !== ValueType.integer) {
      throw new TypeCheck()
    }
    const pos = index.data
    const string = container.data
    if (pos < 0 || pos >= string.length) {
      throw new RangeCheck()
    }
    return {
      type: ValueType.integer,
      data: string.charCodeAt(pos)
    }
  },

  [ValueType.array]: arrayLikeGetter,

  [ValueType.dict]: (container: InternalValue, index: InternalValue): InternalValue => {
    assert: checkDictValue(container)
    if (index.type !== ValueType.string) {
      throw new TypeCheck()
    }
    const name = index.data
    const value = container.data.lookup(name)
    if (value === null) {
      throw new Undefined()
    }
    return value
  },

  [ValueType.block]: arrayLikeGetter,

  [ValueType.proc]: arrayLikeGetter
}

export function get ({ operands }: State): CycleResult {
  const [index, container] = operands.check(null, null)
  const getter = getters[container.type]
  if (getter === undefined) {
    throw new TypeCheck()
  }
  const value = getter(container, index)
  operands.splice(2, value)
  return null
}
