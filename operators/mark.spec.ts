import { executeTests } from '../test-helpers'
import { ValueType } from '../types'

describe('operators/mark', () => {
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
