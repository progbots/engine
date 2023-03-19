import { UnmatchedMark } from '../errors'
import { executeTests } from '../test-helpers'
import { ValueType } from '..'

describe('operators/close-array (])', () => {
  executeTests({
    'creates an array': {
      src: '1 2 [ 3 4 ]'
    //   expect:
    },
    'fails with UnmatchedMark if the stack does not contain a mark': {
      src: '3 4 ]',
      error: UnmatchedMark
    }
  })
})
