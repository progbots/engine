import { ValueType } from '../../index'
import { State } from '../../state/index'
import { executeTests } from '../../test-helpers'

describe('operators/dictstack/systemdict', () => {
  executeTests({
    'puts the systemdict on top of the stack': {
      src: 'systemdict',
      expect: ({ operands, dictionaries }: State) => {
        const top = operands.at(0)
        expect(top.type).toStrictEqual(ValueType.dict)
        expect(top.data).toStrictEqual(dictionaries.systemdict)
      }
    }
  })
})
