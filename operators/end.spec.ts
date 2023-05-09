import { DictStackUnderflow, Undefined } from '../errors/index'
import { State } from '../state/index'
import { executeTests } from '../test-helpers'

describe('operators/end', () => {
  executeTests({
    'removes the dictionary from the dictionary stack': {
      src: 'dict begin end',
      expect: ({ dictionaries }: State) => {
        expect(dictionaries.length).toStrictEqual(2)
      }
    },
    'updates the evaluation context': {
      src: 'dict "test" "hello" set begin end test',
      error: Undefined
    },
    'fails with DictStackUnderflow if no dictionary was added': {
      src: 'end',
      error: DictStackUnderflow
    }
  })
})
