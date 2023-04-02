import { StackUnderflow, TypeCheck } from '../errors'
import { executeTests } from '../test-helpers'

describe('operators/length', () => {
  executeTests({
    'returns the length of an array': [{
      src: '[] length',
      expect: '0'
    }, {
      src: '[31 41 59] length',
      expect: '3'
    }],
    'returns the length of a string': [{
      src: '"" length',
      expect: '0'
    }, {
      src: '"abc" length',
      expect: '3'
    }],
    'returns the number of names in a dictionary': [{
      src: 'dict length',
      expect: '0'
    }, {
      src: 'dict /test 42 set length',
      expect: '1'
    }],
    'returns the length of a proc': [{
      src: '{ } length',
      expect: '0'
    }, {
      src: '{ 4 6 add } length',
      expect: '3'
    }],
    'fails with StackUnderflow on empty stack': {
      src: 'length',
      error: StackUnderflow
    },
    'fails with TypeCheck if container is not an array, a string, a dict or a proc': {
      src: '1 length',
      error: TypeCheck
    }
  })
})
