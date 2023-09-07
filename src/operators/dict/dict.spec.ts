import { IInternalState, scanDictionaryValue } from 'sdk'
import { executeStateTests } from '@test/state/execute'

describe('operators/dict/dict', () => {
  executeStateTests({
    'creates a new dictionary': {
      src: 'dict',
      expect: ({ operands }: IInternalState) => {
        const top = operands.ref[0]
        scanDictionaryValue(top)
      }
    }
  })
})
