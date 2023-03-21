import { UnmatchedMark } from '../errors'
import { executeTests } from '../test-helpers'
import { IArray, ValueType } from '..'
import { State } from '../state'

describe('operators/close-proc (})', () => {
  executeTests({
    'creates a proc': {
      src: '{ 3 4 add }',
      expect: (state: State) => {
        expect(state.stackRef.length).toStrictEqual(1)
        const [{ type, data }] = state.stackRef
        expect(type).toStrictEqual(ValueType.proc)
        const array = data as IArray
        expect(array.length).toStrictEqual(3)
        expect(array.at(0).data).toStrictEqual(3)
        expect(array.at(1).data).toStrictEqual(4)
        expect(array.at(2)).toStrictEqual({
          type: ValueType.call,
          data: 'add'
        })
      }
    },
    'enables call execution': {
      src: '{ add } 3 4 add',
      expect: (state: State) => {
        expect(state.stackRef.length).toStrictEqual(2)
        expect(state.stackRef[0].data).toStrictEqual(7)
      }
    },
    'fails with UnmatchedMark if the stack does not contain a mark': {
      src: '3 4 }',
      error: UnmatchedMark
    }
  })
})