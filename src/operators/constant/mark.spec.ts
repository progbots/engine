import { executeTests } from '../../src/test-helpers'
import { ValueType } from '../../index'

describe('operators/constant/mark', () => {
  executeTests({
    'adds a mark': {
      src: 'mark',
      expect: [{
        type: ValueType.mark,
        data: null
      }]
    }
  })
})
