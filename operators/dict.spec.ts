import { ValueType } from '..'
import { Dictionary } from '../objects/dictionaries'
import { State } from '../state'
import { executeTests } from '../test-helpers'

describe('operators/dict', () => {
  executeTests({
    'creates a new dictionary': {
      src: 'dict',
      expect: (state: State) => {
        const [top] = state.stackRef
        expect(top.type).toStrictEqual(ValueType.dict)
        expect(top.data).toBeInstanceOf(Dictionary)
      }
    }
  })
})
