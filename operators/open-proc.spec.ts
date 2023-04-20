import { executeTests } from '../test-helpers'
import { ValueType } from '../index'

describe('operators/open-proc ({)', () => {
  executeTests({
    'adds a mark': {
      src: '{',
      expect: [{
        type: ValueType.mark,
        data: null
      }],
      cleanBeforeCheckingForLeaks: '}'
    },
    'prevents call execution': {
      src: '{ add',
      expect: [{
        type: ValueType.call,
        data: 'add'
      }, {
        type: ValueType.mark,
        data: null
      }],
      cleanBeforeCheckingForLeaks: '}'
    },
    'prevents call execution (recursive)': {
      src: '{ add { dup } sub ',
      expect: [{
        type: ValueType.call,
        data: 'sub'
      }, {
        type: ValueType.proc,
        data: expect.anything() // Not relevant here
      }, {
        type: ValueType.call,
        data: 'add'
      }, {
        type: ValueType.mark,
        data: null
      }],
      cleanBeforeCheckingForLeaks: '}'
    }

  })
})
