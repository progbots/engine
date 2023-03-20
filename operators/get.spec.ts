import { ValueType } from '..'
import { RangeCheck, StackUnderflow, TypeCheck, Undefined } from '../errors'
import { executeTests } from '../test-helpers'
import { add } from './add'

describe('operators/get', () => {
  executeTests({
    'gets item of an array': {
      src: '[31 41 59] 0 get',
      expect: '31'
    },
    'gets character code of a string': {
      src: '"abc" 0 get',
      expect: '97'
    },
    'gets item of a dictionary': {
      src: 'systemdict /add get',
      expect: [{
        type: ValueType.operator,
        data: add
      }]
    },
    'fails with StackUnderflow on empty stack': {
      src: 'get',
      error: StackUnderflow
    },
    'fails with StackUnderflow if container missing': {
      src: '0 get',
      error: StackUnderflow
    },
    'fails with TypeCheck if container is an array but index is not an integer': {
      src: '[1] /test get',
      error: TypeCheck
    },
    'fails with RangeCheck if container is an array and index is out of range': [{
      src: '[1] 1 get',
      error: RangeCheck
    }, {
      src: '[-1] 1 get',
      error: RangeCheck
    }],
    'fails with TypeCheck if container is a dictionary but index is not a name': {
      src: 'systemdict 0 get',
      error: TypeCheck
    },
    'fails with Undefined if container is a dictionary and index is an unknown key': {
      src: 'systemdict /wontfind get',
      error: Undefined
    }
  })
})
