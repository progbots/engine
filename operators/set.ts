import { ValueType } from '..'
import { RangeCheck, TypeCheck } from '../errors'
import { InternalValue, State } from '../state'
import { checkOperands } from './operands'
import { ArrayLike } from '../objects/Array'
import { ShareableObject } from '../objects/ShareableObject'
import { IWritableDictionary } from '../objects/dictionaries'

const setters: Record<string, (state: State) => InternalValue> = {
  [ValueType.string]: (state: State): InternalValue => {
    const [value, index, container] = state.operandsRef
    if (index.type !== ValueType.integer || value.type !== ValueType.integer) {
      throw new TypeCheck()
    }
    const pos = index.data as number
    const string = container.data as string
    if (pos < 0 || pos >= string.length) {
      throw new RangeCheck()
    }
    const parts: string[] = []
    if (pos > 0) {
      parts.push(string.substring(0, pos))
    }
    parts.push(String.fromCharCode(value.data as number))
    if (pos + 1 < string.length) {
      parts.push(string.substring(pos + 1))
    }
    return {
      type: ValueType.string,
      data: parts.join('')
    }
  },

  [ValueType.array]: (state: State): InternalValue => {
    const [value, index, container] = state.operandsRef
    if (index.type !== ValueType.integer) {
      throw new TypeCheck()
    }
    const pos = index.data as number
    const array = container.data as ArrayLike
    if (pos >= array.length) {
      throw new RangeCheck()
    }
    array.set(pos, value)
    return container
  },

  [ValueType.dict]: (state: State): InternalValue => {
    const [value, index, container] = state.operandsRef
    if (index.type !== ValueType.name) {
      throw new TypeCheck()
    }
    const name = index.data as string
    const iDict = container.data as IWritableDictionary
    iDict.def(name, value)
    return container
  }
}

export function * set (state: State): Generator {
  const [,, container] = checkOperands(state, null, null, null)
  const setter = setters[container.type]
  if (setter === undefined) {
    throw new TypeCheck()
  }
  ShareableObject.addRef(container)
  try {
    const value = setter(state)
    state.pop()
    state.pop()
    state.pop()
    state.push(value)
  } finally {
    ShareableObject.release(container)
  }
}
