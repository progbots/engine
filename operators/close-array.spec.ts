import { UnmatchedMark } from '../errors'
import { executeTests } from '../test-helpers'
import { IArray, ValueType } from '..'
import { State } from '../state'

describe('operators/close-array (])', () => {
  executeTests({
    'creates an array': {
      src: '1 2 [ 3 4 ]',
      expect: (state: State) => {
        expect(state.stackRef.length).toStrictEqual(3)
        const [{ type, data }] = state.stackRef
        expect(type).toStrictEqual(ValueType.array)
        const array = data as IArray
        expect(array.length).toStrictEqual(2)
        expect(array.at(0).data).toStrictEqual(3)
        expect(array.at(1).data).toStrictEqual(4)
      }
    },
    'evaluates calls during the array creation': {
      src: '1 2 [ 3 4 add ]',
      expect: (state: State) => {
        expect(state.stackRef.length).toStrictEqual(3)
        const [{ type, data }] = state.stackRef
        expect(type).toStrictEqual(ValueType.array)
        const array = data as IArray
        expect(array.length).toStrictEqual(1)
        expect(array.at(0).data).toStrictEqual(7)
      }
    },
    'fails with UnmatchedMark if the stack does not contain a mark': {
      src: '3 4 ]',
      error: UnmatchedMark
    }
  })
})
