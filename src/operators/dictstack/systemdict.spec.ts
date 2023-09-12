import { DictionaryValue, ValueType } from '@api'
import { IInternalState } from '@sdk'
import { executeStateTests } from '@test/state/execute'

describe('operators/dictstack/systemdict', () => {
  executeStateTests({
    'puts the systemdict on top of the stack': {
      src: 'systemdict',
      expect: ({ operands, dictionaries }: IInternalState) => {
        const top = operands.at(0)
        expect(top).toStrictEqual<DictionaryValue>({
          type: ValueType.dictionary,
          dictionary: dictionaries.system
        })
      }
    }
  })
})
