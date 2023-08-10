import { RangeCheck, StackUnderflow, TypeCheck } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/operandstack/roll', () => {
  executeTests({
    'rolls 1 down': [{
      src: 'mark "a" "b" "c" 3 -1 roll',
      expect: 'mark "b" "c" "a"'
    }, {
      src: 'mark "a" "b" "c" "d" 4 -1 roll',
      expect: 'mark "b" "c" "d" "a"'
    }, {
      src: 'mark "a" "b" "c" "d" "e" 5 -1 roll',
      expect: 'mark "b" "c" "d" "e" "a"'
    }],
    'rolls 1 up (and handles shared objects)': {
      src: 'mark "a" ["b" "c"] "d" 3 1 roll aload',
      expect: 'mark "d" "a" "b" "c"'
    },
    'handles different rolls': [{
      src: 'mark "a" "b" "c" 3 2 roll',
      expect: 'mark "b" "c" "a"'
    }],
    'does nothing if step is 0': {
      src: 'mark "a" "b" "c" 3 0 roll',
      expect: 'mark "a" "b" "c"'
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
    'fails with RangeCheck on invalid size': [{
      src: '"a" "b" "c" -3 -1 roll',
      error: RangeCheck
    }, {
      src: '"a" "b" "c" 0 1 roll',
      error: RangeCheck
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
