import { ValueType } from '../index'
import { State } from '../state/index'
import { executeTests } from '../test-helpers'

describe('operators/systemdict', () => {
  executeTests({
    'puts the systemdict on top of the stack': {
      src: 'systemdict',
      expect: (state: State) => {
        const [top] = state.operandsRef
        expect(top.type).toStrictEqual(ValueType.dict)
        expect(top.data).toStrictEqual(state.systemdict)
      }
    }
  })
})
