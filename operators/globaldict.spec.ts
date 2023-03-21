import { ValueType } from '..'
import { State } from '../state'
import { executeTests } from '../test-helpers'

describe('operators/globaldict', () => {
  executeTests({
    'puts the globaldict on top of the stack': {
      src: 'globaldict',
      expect: (state: State) => {
        const [top] = state.stackRef
        expect(top.type).toStrictEqual(ValueType.dict)
        expect(top.data).toStrictEqual(state.globaldict)
      }
    }
  })
})