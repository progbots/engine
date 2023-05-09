import { State } from '../state/index'
import { executeTests } from '../test-helpers'

describe('operators/clear', () => {
  executeTests({
    'removes all items of the stack': {
      src: '1 2 clear',
      expect: ({ operands }: State) => expect(operands.length).toStrictEqual(0)
    }
  })
})
