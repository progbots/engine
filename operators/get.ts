import { IDictionary, Value, ValueType } from '..'
import { RangeCheck, TypeCheck, Undefined } from '../errors'
import { State } from '../state'
import { checkStack } from './check-state'
import { ArrayLike } from '../objects/Array'
import { ShareableObject } from '../objects/ShareableObject'

function arrayLikeGetter (state: State): Value {
  const [index, container] = state.stackRef
  if (index.type !== ValueType.integer) {
    throw new TypeCheck()
  }
  const pos = index.data as number
  const array = container.data as ArrayLike
  return array.at(pos)
}

const getters: Record<string, (state: State) => Value> = {
  [ValueType.string]: (state: State): Value => {
    const [index, container] = state.stackRef
    if (index.type !== ValueType.integer) {
      throw new TypeCheck()
    }
    const pos = index.data as number
    const string = container.data as string
    if (pos < 0 || pos >= string.length) {
      throw new RangeCheck()
    }
    return {
      type: ValueType.integer,
      data: string.charCodeAt(pos)
    }
  },

  [ValueType.array]: arrayLikeGetter,

  [ValueType.dict]: (state: State): Value => {
    const [index, container] = state.stackRef
    if (index.type !== ValueType.name) {
      throw new TypeCheck()
    }
    const name = index.data as string
    const iDict = container.data as IDictionary
    const value = iDict.lookup(name)
    if (value === null) {
      throw new Undefined()
    }
    return value
  },

  [ValueType.proc]: arrayLikeGetter
}

export function * get (state: State): Generator {
  checkStack(state, null, null)
  const [, container] = state.stackRef
  const getter = getters[container.type]
  if (getter === undefined) {
    throw new TypeCheck()
  }
  ShareableObject.addRef(container)
  try {
    const value = getter(state)
    state.pop()
    state.pop()
    state.push(value)
  } finally {
    ShareableObject.release(container)
  }
}
