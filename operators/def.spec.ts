import { ValueType } from '..'
import { StackUnderflow, TypeCheck } from '../errors'
import { State } from '../state'
import { executeTests } from '../test-helpers'

describe('operators/def', () => {
  executeTests({
    'sets a value on the top dictionary': {
      src: '/test 1 def',
      expect: (state: State) => {
        expect(state.operandsRef.length).toStrictEqual(0)
        expect(state.lookup('test')).toStrictEqual({
          type: ValueType.integer,
          data: 1
        })
        expect(state.globaldict.names).toStrictEqual(['test'])
      }
    },
    'fails with StackUnderflow on empty stack': {
      src: 'def',
      error: StackUnderflow
    },
    'fails with StackUnderflow on a single stack item': {
      src: '1 def',
      error: StackUnderflow
    },
    'fails with TypeCheck if no name is provided': {
      src: '0 1 def',
      error: TypeCheck
    }
  })
})
