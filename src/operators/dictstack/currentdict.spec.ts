import { executeStateTests } from '@test/state/execute'

describe('operators/dictstack/currentdict', () => {
  executeStateTests({
    'puts the current dictionary on top of the stack': {
      src: 'dict begin "test" 42 def currentdict "test" get end',
      expect: '42'
    }
  })
})
