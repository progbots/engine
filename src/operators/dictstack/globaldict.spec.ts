import { DictionaryValue, ValueType } from '@api'
import { IInternalState } from '@sdk'
import { executeStateTests } from '@test/state/execute'

describe('operators/dictstack/globaldict', () => {
  executeStateTests({
    'puts the globaldict on top of the stack': {
      src: 'globaldict',
      expect: ({ operands, dictionaries }: IInternalState) => {
        const top = operands.ref[0]
        expect(top).toStrictEqual<DictionaryValue>({
          type: ValueType.dictionary,
          dictionary: dictionaries.global
        })
      }
    }
  })
})
