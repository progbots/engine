import { Value, ValueType } from '../index'
import { StackUnderflow, TypeCheck } from '../errors/index'
import { State } from '../state/index'
import { executeTests } from '../test-helpers'

describe('operators/throw', () => {
  executeTests({
    'fails with StackUnderflow on an empty stack': {
      src: 'throw',
      error: StackUnderflow
    },
    'fails with TypeCheck if the operand is not a dict': [{
      src: '{ } throw',
      error: TypeCheck
    }, {
      src: '"not_a_proc" throw',
      error: TypeCheck
    }],
    'fails with TypeCheck if the operand is not a writable dict': {
      host: {
        rodict: function * (state: State): Generator {
          state.push({
            type: ValueType.dict,
            data: {
              get names () {
                return ['name', 'message']
              },
              lookup (name: string): Value | null {
                return null
              }
            }
          })
        }
      },
      src: 'rodict throw',
      error: TypeCheck
    }
  })
})
