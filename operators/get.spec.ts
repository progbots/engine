import { ValueType } from '../index'
import { RangeCheck, StackUnderflow, TypeCheck, Undefined } from '../errors/index'
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
      src: 'systemdict "add" get',
      expect: [{
        type: ValueType.operator,
        data: add
      }]
    },
    'gets item of a proc': {
      src: '{ 1 2 } 0 get',
      expect: '1'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'get',
      error: StackUnderflow
    },
    'fails with StackUnderflow if container missing': {
      src: '0 get',
      error: StackUnderflow
    },
    'fails with TypeCheck if container is not an array, a string, a dict or a proc': {
      src: 'mark "whatever" get',
      error: TypeCheck
    },
    'fails with TypeCheck if container is an array but index is not an integer': {
      src: '[1] "test" get',
      error: TypeCheck
    },
    'fails with RangeCheck if container is an array and index is out of range': [{
      src: '[1] 1 get',
      error: RangeCheck
    }, {
      src: '[-1] -1 get',
      error: RangeCheck
    }],
    'fails with TypeCheck if container is a string but index is not an integer': {
      src: '"a" "1" get',
      error: TypeCheck
    },
    'fails with RangeCheck if container is a string and index is out of range': [{
      src: '"a" 1 get',
      error: RangeCheck
    }, {
      src: '"a" -1 get',
      error: RangeCheck
    }],
    'fails with TypeCheck if container is a dictionary but index is not a name': {
      src: 'systemdict 0 get',
      error: TypeCheck
    },
    'fails with Undefined if container is a dictionary and index is an unknown key': {
      src: 'systemdict "wontfind" get',
      error: Undefined
    },
    'fails with TypeCheck if container is a proc but index is not an integer': {
      src: '{ } "name" get',
      error: TypeCheck
    },
    'fails with RangeCheck if container is a proc and index is out of range': {
      src: '{ } 1 get',
      error: RangeCheck
    }
  })
})
