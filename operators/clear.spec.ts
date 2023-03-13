import { IState } from '../types'
import { executeTests } from '../test-helpers'

describe('operators/clear', () => {
  executeTests({
    'removes all items of the stack': {
      src: '1 2 clear',
      expect: (state: IState) => expect(state.stack().length).toStrictEqual(0)
    }
  })
})
