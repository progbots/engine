import { ValueType } from '../index'
import { State } from '../state/index'
import { executeTests } from '../test-helpers'

describe('operators/globaldict', () => {
  executeTests({
    'puts the globaldict on top of the stack': {
      src: 'globaldict',
      expect: ({ operands, dictionaries }: State) => {
        const top = operands.ref[0]
        expect(top.type).toStrictEqual(ValueType.dict)
        expect(top.data).toStrictEqual(dictionaries.globaldict)
      }
    }
  })
})
