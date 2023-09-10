import { executeStateTests } from '@test/state/execute'

describe('operators/dictstack/dictstack', () => {
  executeStateTests({
    'puts an array containing the dictionary stack on top of the stack': [{
      src: 'dictstack length',
      expect: '2'
    }, {
      src: 'dict begin "test" 42 def dictstack 0 get "test" get end',
      expect: '42'
    }, {
      src: 'dictstack 1 get',
      expect: 'systemdict'
    }]
  })
})
