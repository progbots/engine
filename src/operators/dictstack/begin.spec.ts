import { StackUnderflow, TypeCheck } from '@errors'
import { executeStateTests } from '@test/state/execute'

describe('operators/dictstack/begin', () => {
  executeStateTests({
    'adds the dictionary to the dictionary stack': {
      src: 'dict begin dictstack length end',
      expect: '3'
    },
    'updates the evaluation context': {
      src: 'dict "test" "hello" set begin test end',
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
