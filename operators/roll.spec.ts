import { StackUnderflow, TypeCheck } from '../errors/index'
import { executeTests } from '../test-helpers'

describe('operators/roll', () => {
  executeTests({
    'rolls 1 down': {
      src: '"a" "b" "c" 3 -1 roll',
      expect: '"b" "c" "a"'
    },
    'rolls 1 up': {
      src: '"a" "b" "c" 3 1 roll',
      expect: '"c" "a" "b"'
    },
    'does nothing if 0': {
      src: '"a" "b" "c" 3 0 roll',
      expect: '"a" "b" "c"'
    },
    'fails with StackUnderflow on insufficient stack': [{
      src: 'roll',
      error: StackUnderflow
    }, {
      src: '1 roll',
      error: StackUnderflow
    }, {
      src: '1 1 roll',
      error: StackUnderflow
    }],
    'fails with TypeCheck on invalid parameters': [{
      src: '"a" "b" "c" 3 "a" roll',
      error: TypeCheck
    }, {
      src: '"a" "b" "c" "d" 1 roll',
      error: TypeCheck
    }]
  })
})
