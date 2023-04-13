import { StackUnderflow, TypeCheck } from '../errors/index'
import { State } from '../state/index'
import { executeTests } from '../test-helpers'

describe('operators/begin', () => {
  executeTests({
    'adds the dictionary to the dictionary stack': {
      src: 'dict begin',
      expect: (state: State) => {
        expect(state.dictionariesRef.length).toStrictEqual(3)
      }
    },
    'updates the evaluation context': {
      src: 'dict /test "hello" set begin test',
      expect: '"hello"'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'begin',
      error: StackUnderflow
    },
    'fails with TypeCheck if no dictionary is used': {
      src: '1 begin',
      error: TypeCheck
    }
  })
})
