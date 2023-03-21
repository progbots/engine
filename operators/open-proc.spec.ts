import { executeTests } from '../test-helpers'
import { ValueType } from '..'

describe('operators/open-proc ({)', () => {
  executeTests({
    'adds a mark': {
      src: '{',
      expect: [{
        type: ValueType.mark,
        data: null
      }]
    },
    'prevents call execution': {
      src: '{ add',
      expect: [{
        type: ValueType.call,
        data: 'add'
      }, {
        type: ValueType.mark,
        data: null
      }]
    }
  })
})
