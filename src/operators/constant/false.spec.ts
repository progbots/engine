import { ValueType } from '@api'
import { executeStateTests } from '@test/state/execute'

describe('operators/constant/false', () => {
  executeStateTests({
    'adds false to the stack': {
      src: 'false',
      expect: [{
        type: ValueType.boolean,
        isSet: false
      }]
    }
  })
})
