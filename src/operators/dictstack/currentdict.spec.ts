import { executeTests } from '../../src/test-helpers'

describe('operators/dictstack/currentdict', () => {
  executeTests({
    'puts the current dictionary on top of the stack': {
      src: 'dict begin "test" 42 def currentdict "test" get end',
      expect: '42'
    }
  })
})
