import { executeTests } from '../test-helpers'

describe('operators/currentdict', () => {
  executeTests({
    'puts the current dictionary on top of the stack': {
      src: '/test 42 def currentdict /test get',
      expect: '42'
    }
  })
})
