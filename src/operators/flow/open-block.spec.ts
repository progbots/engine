import { executeTests } from '../../src/test-helpers'
import { ValueType } from '../../index'

// test-for ../open-close-helper.ts

describe('operators/flow/open-block ({)', () => {
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
        type: ValueType.block,
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
