import { IInternalState } from '@sdk'
import { DictStackUnderflow, Undefined } from '@errors'
import { executeStateTests } from '@test/state/execute'

describe('operators/dictstack/end', () => {
  executeStateTests({
    'removes the dictionary from the dictionary stack': {
      src: 'dict begin end',
      expect: ({ dictionaries }: IInternalState) => {
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
