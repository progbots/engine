import { ValueType } from '@api'
import { executeStateTests } from '@test/state/execute'

// test-for ../open-close-helper.ts

describe('operators/flow/open-block ({)', () => {
  executeStateTests({
    'adds a mark': {
      src: '{',
      expect: [{
        type: ValueType.mark
      }],
      cleanBeforeCheckingForLeaks: '}'
    },
    'prevents call execution': {
      src: '{ add',
      expect: [{
        type: ValueType.call,
        call: 'add'
      }, {
        type: ValueType.mark
      }],
      cleanBeforeCheckingForLeaks: '}'
    },
    'prevents call execution (recursive)': {
      src: '{ add { dup } sub ',
      expect: [{
        type: ValueType.call,
        call: 'sub'
      }, {
        type: ValueType.block,
        block: expect.anything() // Not relevant here
      }, {
        type: ValueType.call,
        call: 'add'
      }, {
        type: ValueType.mark
      }],
      cleanBeforeCheckingForLeaks: '}'
    }
  })
})
