import { StackUnderflow, TypeCheck } from '../errors/index'
import { executeTests } from '../test-helpers'

describe('operators/roll', () => {
  executeTests({
    'rolls 1 down': {
      src: '"a" "b" "c" 3 -1 roll',
      expect: '"b" "c" "a"'
    },
    'rolls 1 up (and handles shared objects)': {
      src: '"a" ["b" "c"] "d" 3 1 roll aload',
      expect: '"d" "a" "b" "c"'
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
      error: StackUnderflow,
      expect: '1 1'
    }, {
      src: '2 1 roll',
      error: StackUnderflow,
      expect: '2 1'
    }],
    'fails with TypeCheck on invalid parameters': [{
      src: '"a" "b" "c" 3 "a" roll',
      error: TypeCheck,
      expect: '"a" "b" "c" 3 "a"'
    }, {
      src: '"a" "b" "c" "d" 1 roll',
      error: TypeCheck,
      expect: '"a" "b" "c" "d" 1'
    }]
  })
})
