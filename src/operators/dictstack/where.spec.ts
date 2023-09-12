import { StackUnderflow, TypeCheck } from '@errors'
import { executeStateTests } from '@test/state/execute'

describe('operators/dictstack/where', () => {
  executeStateTests({
    'returns the dictionary and true when found': {
      src: 'mark "add" where',
      expect: 'mark systemdict true'
    },
    'returns false when if not found': {
      src: 'mark "add-" where',
      expect: 'mark false'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'where',
      error: StackUnderflow
    },
    'fails with TypeCheck if the parameter is not a string': {
      src: '0 where',
      error: TypeCheck
    }
  })
})
