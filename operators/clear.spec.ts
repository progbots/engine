import { State } from '../state'
import { executeTests } from '../test-helpers'

describe('operators/clear', () => {
  executeTests({
    'removes all items of the stack': {
      src: '1 2 clear',
      expect: (state: State) => expect(state.operandsRef.length).toStrictEqual(0)
    }
  })
})
