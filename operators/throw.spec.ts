import { Value, ValueType } from '../index'
import { StackUnderflow, TypeCheck } from '../errors/index'
import { State } from '../state/index'
import { executeTests } from '../test-helpers'

describe('operators/throw', () => {
  executeTests({
    'enables the forward of a known excption': {
      src: '{ stackunderflow } { throw } catch',
      error: StackUnderflow
    },
    'enables the creation of custom exceptions': {
      src: `dict
            dup "name" "test" set
            dup "message" "this is a test" set
            throw`,
      expect: (state: State, exceptionCaught?: Error) => {
        expect(exceptionCaught).not.toBeUndefined()
        if (exceptionCaught !== undefined) {
          expect(exceptionCaught.name).toStrictEqual('Custom:test')
          expect(exceptionCaught.message).toStrictEqual('this is a test')
        }
      }
    },
    'fails with StackUnderflow on an empty stack': {
      src: 'throw',
      error: StackUnderflow
    },
    'fails with TypeCheck on an empty dict': {
      src: 'dict throw',
      error: TypeCheck
    },
    'fails with TypeCheck if the dict does not contain at least name and message': [{
      src: 'dict dup "name" "test" set throw',
      error: TypeCheck
    }, {
      src: 'dict dup "message" "test" set throw',
      error: TypeCheck
    }],
    'fails with TypeCheck if the operand is not a dict': [{
      src: '{ } throw',
      error: TypeCheck
    }, {
      src: '"not_a_proc" throw',
      error: TypeCheck
    }],
    'fails with TypeCheck if the operand is not a writable dict': {
      host: {
        rodict: function * ({ operands }: State): Generator {
          operands.push({
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
