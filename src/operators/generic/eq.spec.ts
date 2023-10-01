import { StackUnderflow } from '@errors'
import { executeStateTests } from '@test/state/execute'

describe('operators/generic/eq', () => {
  executeStateTests({
    'outputs 1 == 1': {
      src: '1 1 eq',
      expect: 'true'
    },
    'outputs 1 == 2': {
      src: '1 2 eq',
      expect: 'false'
    },
    'outputs 1 == "name"': {
      src: '1 "name" eq',
      expect: 'false'
    },
    'outputs "name" == "name"': {
      src: '"name" "name" eq',
      expect: 'true'
    },
    'outputs name == "name"': {
      src: '{ name } aload "name" eq',
      expect: 'false'
    },
    'outputs [ 1 ] == [ 1 ] (same ref)': {
      src: '[ 1 ] dup eq',
      expect: 'true'
    },
    'outputs [ 1 ] == [ 1 ] (not the same ref)': {
      src: '[ 1 ] [ 1 ] eq',
      expect: 'false'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'eq',
      error: StackUnderflow
    },
    'fails with StackUnderflow if only one item in the stack': {
      src: '1 eq',
      error: StackUnderflow
    }
  })
})
