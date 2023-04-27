import { IDictionary, ValueType } from '../index'
import { TypeCheck } from '../errors/index'
import { InternalValue, State } from '../state/index'
import { checkOperands, spliceOperands } from './operands'
import { ArrayLike } from '../objects/Array'
import { ShareableObject } from '../objects/ShareableObject'

function arrayLikeImpl (state: State): boolean {
  const [value, container] = state.operandsRef
  const array = container.data as ArrayLike
  return array.some((item: InternalValue) => item.type === value.type && item.data === value.data)
}

const implementations: Record<string, (state: State) => boolean> = {
  [ValueType.array]: arrayLikeImpl,

  [ValueType.dict]: (state: State): boolean => {
    const [index, container] = state.operandsRef
    if (index.type !== ValueType.string) {
      throw new TypeCheck()
    }
    const name = index.data as string
    const iDict = container.data as IDictionary
    return iDict.names.includes(name)
  },

  [ValueType.proc]: arrayLikeImpl
}

export function * inOp (state: State): Generator {
  const [, container] = checkOperands(state, null, null)
  const impl = implementations[container.type]
  if (impl === undefined) {
    throw new TypeCheck()
  }
  ShareableObject.addRef(container)
  try {
    const data = impl(state)
    spliceOperands(state, 2, {
      type: ValueType.boolean,
      data
    })
  } finally {
    ShareableObject.release(container)
  }
}

Object.defineProperty(inOp, 'name', {
  value: 'in',
  writable: false
})
