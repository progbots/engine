import { UnmatchedMark } from '../errors/index'
import { executeTests } from '../test-helpers'

describe('operators/counttomark', () => {
  executeTests({
    'counts the number of items up to the mark': {
      src: '1 2 mark 3 4 counttomark',
      expect: '1 2 mark 3 4 2'
    },
    'fails with UnmatchedMark if the stack does not contain a mark': {
      src: 'counttomark',
      error: UnmatchedMark
    }
  })
})
