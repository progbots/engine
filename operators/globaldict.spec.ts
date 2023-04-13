import { ValueType } from '../index'
import { State } from '../state/index'
import { executeTests } from '../test-helpers'

describe('operators/globaldict', () => {
  executeTests({
    'puts the globaldict on top of the stack': {
      src: 'globaldict',
      expect: (state: State) => {
        const [top] = state.operandsRef
        expect(top.type).toStrictEqual(ValueType.dict)
        expect(top.data).toStrictEqual(state.globaldict)
      }
    }
  })
})
