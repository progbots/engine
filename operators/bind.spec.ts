import { ValueType } from '..'
import { StackUnderflow, TypeCheck } from '../errors'
import { State } from '../state'
import { ArrayLike } from '../objects/Array'
import { executeTests } from '../test-helpers'

import { trueOp, openArray, closeArray } from '.'

describe('operators/bind', () => {
  executeTests({
    'replaces proc calls with their callees': {
      src: '{ true [ 42 ] /unchanged } bind',
      expect: (state: State) => {
        expect(state.stackRef.length).toStrictEqual(1)
        expect(state.stackRef[0].type).toStrictEqual(ValueType.proc)
        const array = state.stackRef[0].data as unknown as ArrayLike
        expect(array.ref[0]).toStrictEqual({
          type: ValueType.operator,
          data: trueOp
        })
        expect(array.ref[1]).toStrictEqual({
          type: ValueType.operator,
          data: openArray
        })
        expect(array.ref[2]).toStrictEqual({
          type: ValueType.integer,
          data: 42
        })
        expect(array.ref[3]).toStrictEqual({
          type: ValueType.operator,
          data: closeArray
        })
        expect(array.ref[4]).toStrictEqual({
          type: ValueType.name,
          data: 'unchanged'
        })
      }
    },
    'fails with StackUnderflow on empty stack': {
      src: 'bind',
      error: StackUnderflow
    },
    'fails with TypeCheck if the parameter is not a proc': {
      src: '0 bind',
      error: TypeCheck
    }
  })
})
