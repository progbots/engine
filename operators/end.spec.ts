import { DictStackUnderflow, Undefined } from '../errors'
import { State } from '../state'
import { executeTests } from '../test-helpers'

describe('operators/end', () => {
  executeTests({
    'removes the dictionary from the dictionary stack': {
      src: 'dict begin end',
      expect: (state: State) => {
        expect(state.dictionariesRef.length).toStrictEqual(2)
      }
    },
    'updates the evaluation context': {
      skip: true,
      src: 'dict dup /test "hello" put begin end test',
      error: Undefined
    },
    'fails with DictStackUnderflow if no dictionary was added': {
      src: 'end',
      error: DictStackUnderflow
    }
  })
})
