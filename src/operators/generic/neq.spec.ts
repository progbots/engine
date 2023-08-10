import { StackUnderflow } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/generic/neq', () => {
  executeTests({
    'outputs 1 != 1': {
      src: '1 1 neq',
      expect: 'false'
    },
    'outputs 1 != 2': {
      src: '1 2 neq',
      expect: 'true'
    },
    'outputs 1 != "name"': {
      src: '1 "name" neq',
      expect: 'true'
    },
    'outputs "name" != "name"': {
      src: '"name" "name" neq',
      expect: 'false'
    },
    'outputs name != "name"': {
      src: '{ name } aload "name" neq',
      expect: 'true'
    },
    'outputs [ 1 ] != [ 1 ] (same ref)': {
      src: '[ 1 ] dup neq',
      expect: 'false'
    },
    'outputs [ 1 ] != [ 1 ] (not the same ref)': {
      src: '[ 1 ] [ 1 ] neq',
      expect: 'true'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'neq',
      error: StackUnderflow
    },
    'fails with StackUnderflow if only one item in the stack': {
      src: '1 neq',
      error: StackUnderflow
    }
  })
})
