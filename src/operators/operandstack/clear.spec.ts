import { State } from '../../state/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/operandstack/clear', () => {
  executeTests({
    'removes all items of the stack': {
      src: '1 2 clear',
      expect: ({ operands }: State) => expect(operands.length).toStrictEqual(0)
    }
  })
})
