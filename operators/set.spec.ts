import { RangeCheck, StackUnderflow, TypeCheck } from '../errors/index'
import { executeTests } from '../test-helpers'

describe('operators/set', () => {
  executeTests({
    'sets item in an array': {
      src: '[31 41 59] 1 42 set',
      expect: '[31 42 59]'
    },
    'sets character code of a string': {
      src: '"abc" 1 66 set',
      expect: '"aBc"'
    },
    'sets item in a dictionary': {
      src: 'dict /test 42 set /test get',
      expect: '42'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'set',
      error: StackUnderflow
    },
    'fails with StackUnderflow if parameters are missing': [{
      src: '0 set',
      error: StackUnderflow
    }, {
      src: '0 0 set',
      error: StackUnderflow
    }],
    'fails with TypeCheck if container is an array but index is not an integer': {
      src: '[1] /test 0 set',
      error: TypeCheck
    },
    'fails with RangeCheck if container is an array and index is out of range': [{
      src: '[1] 1 0 set',
      error: RangeCheck
    }, {
      src: '[-1] -1 0 set',
      error: RangeCheck
    }],
    'fails with RangeCheck if container is a string and index is out of range': [{
      src: '"abc" 3 0 set',
      error: RangeCheck
    }, {
      src: '"abc" -1 0 set',
      error: RangeCheck
    }],
    'fails with TypeCheck if container is a dictionary but index is not a name': {
      src: 'systemdict 0 0 set',
      error: TypeCheck
    }
  })
})
