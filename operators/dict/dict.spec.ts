import { ValueType } from '../../index'
import { Dictionary } from '../../objects/dictionaries'
import { State } from '../../state/index'
import { executeTests } from '../../test-helpers'

describe('operators/dict/dict', () => {
  executeTests({
    'creates a new dictionary': {
      src: 'dict',
      expect: ({ operands }: State) => {
        const top = operands.ref[0]
        expect(top.type).toStrictEqual(ValueType.dict)
        expect(top.data).toBeInstanceOf(Dictionary)
      }
    }
  })
})
