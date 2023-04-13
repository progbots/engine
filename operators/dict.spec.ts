import { ValueType } from '../index'
import { Dictionary } from '../objects/dictionaries'
import { State } from '../state/index'
import { executeTests } from '../test-helpers'

describe('operators/dict', () => {
  executeTests({
    'creates a new dictionary': {
      src: 'dict',
      expect: (state: State) => {
        const [top] = state.operandsRef
        expect(top.type).toStrictEqual(ValueType.dict)
        expect(top.data).toBeInstanceOf(Dictionary)
      }
    }
  })
})
