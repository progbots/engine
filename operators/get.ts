import { IDictionary, Value, ValueType } from '..'
import { RangeCheck, TypeCheck, Undefined } from '../errors'
import { State } from '../state'
import { checkStack } from './check-state'
import { ArrayLike } from '../objects/Array'
import { ShareableObject } from '../objects/ShareableObject'

interface GetterResult {
  shareable?: ShareableObject
  value: Value
}

const getters: Record<string, (state: State) => GetterResult> = {
  [ValueType.string]: (state: State): GetterResult => {
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
      value: {
        type: ValueType.integer,
        data: string.charCodeAt(pos)
      }
    }
  },

  [ValueType.array]: (state: State): GetterResult => {
    const [index, container] = state.stackRef
    if (index.type !== ValueType.integer) {
      throw new TypeCheck()
    }
    const pos = index.data as number
    const array = container.data as ArrayLike
    const value = array.at(pos)
    return {
      shareable: array,
      value
    }
  },

  [ValueType.dict]: (state: State): GetterResult => {
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
    return {
      shareable: container.data as unknown as ShareableObject,
      value
    }
  }
}

export function * get (state: State): Generator {
  checkStack(state, null, null)
  const [, container] = state.stackRef
  const getter = getters[container.type]
  if (getter === undefined) {
    throw new TypeCheck()
  }
  const { shareable, value } = getter(state)
  if (shareable !== undefined) {
    shareable.addRef()
  }
  state.pop()
  state.pop()
  state.push(value)
  if (shareable !== undefined) {
    shareable.release()
  }
}
