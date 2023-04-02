import { executeTests } from '../test-helpers'

describe('operators/dictstack', () => {
  executeTests({
    'puts an array containing the dictionary stack on top of the stack': [{
      src: 'dictstack length',
      expect: '2'
    }, {
      src: '/test 42 def dictstack 0 get /test get',
      expect: '42'
    }, {
      src: 'dictstack 1 get',
      expect: 'systemdict'
    }]
  })
})
