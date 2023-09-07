import { ValueType } from '@api'
import { executeStateTests } from '@test/state/execute'

describe('operators/constant/true', () => {
  executeStateTests({
    'adds true to the stack': {
      src: 'true',
      expect: [{
        type: ValueType.boolean,
        isSet: true
      }]
    }
  })
})
