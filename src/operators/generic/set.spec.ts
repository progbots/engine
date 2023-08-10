import { RangeCheck, StackUnderflow, TypeCheck } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/generic/set', () => {
  executeTests({
    'sets item in an array': {
      src: '[31 41 59] 1 42 set',
      expect: '[31 42 59]'
    },
    'sets character code of a string': [{
      src: '"abc" 0 65 set',
      expect: '"Abc"'
    }, {
      src: '"abc" 1 66 set',
      expect: '"aBc"'
    }],
    'sets item in a dict': {
      src: 'dict "test" 42 set "test" get',
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
      src: '[1] "test" 0 set',
      error: TypeCheck
    },
    'fails with RangeCheck if container is an array and index is out of range': [{
      src: '[1] 1 0 set',
      error: RangeCheck
    }, {
      src: '[-1] -1 0 set',
      error: RangeCheck
    }],
    'fails with TypeCheck if container is a string and index is not an integer': {
      src: '"abc" "a" 0 set',
      error: TypeCheck
    },
    'fails with TypeCheck if container is a string and value is not an integer': {
      src: '"abc" 0 "d" set',
      error: TypeCheck
    },
    'fails with RangeCheck if container is a string and index is out of range': [{
      src: '"abc" 3 0 set',
      error: RangeCheck
    }, {
      src: '"abc" -1 0 set',
      error: RangeCheck
    }],
    'fails with TypeCheck if container is a dict but index is not a name': {
      src: 'systemdict 0 0 set',
      error: TypeCheck
    },
    'fails with TypeCheck if container is not a string, an array or a dict': {
      src: '{ test } 0 0 set',
      error: TypeCheck
    }
  })
})
