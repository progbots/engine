import { UnmatchedMark } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/operandstack/cleartomark', () => {
  executeTests({
    'clears the stack up to the mark': {
      src: '1 2 mark 3 4 cleartomark',
      expect: '1 2'
    },
    'fails with UnmatchedMark if the stack does not contain a mark': {
      src: 'cleartomark',
      error: UnmatchedMark
    }
  })
})
