import { ValueType } from '@api'
import { executeStateTests } from '@test/state/execute'

describe('operators/constant/mark', () => {
  executeStateTests({
    'adds a mark': {
      src: 'mark',
      expect: [{
        type: ValueType.mark
      }]
    }
  })
})
