import { StackUnderflow, TypeCheck } from '@errors'
import { executeStateTests } from '@test/state/execute'

describe('operators/generic/in', () => {
  executeStateTests({
    'checks item of an array': [{
      src: '[31 41 59] 41 in',
      expect: 'true'
    }, {
      src: '[31 41 59] 42 in',
      expect: 'false'
    }],
    'checks name of a dictionary': [{
      src: 'systemdict "add" in',
      expect: 'true'
    }, {
      src: 'systemdict "aadd" in',
      expect: 'false'
    }],
    'checks item of a block': [{
      src: '{ 1 2 add } 2 in',
      expect: 'true'
    }, {
      src: '{ 1 2 add } 3 in',
      expect: 'false'
    }, {
      src: '{ 1 2 "add" } "add" in',
      expect: 'true'
    }, {
      src: '{ 1 2 add } "add" in',
      expect: 'false'
    }],
    'checks item of a proc': [{
      src: 'dict begin "test" { 1 2 add } def currentdict "test" get 2 in end',
      expect: 'true'
    }, {
      src: 'dict begin "test" { 1 2 add } def currentdict "test" get 3 in end',
      expect: 'false'
    }, {
      src: 'dict begin "test" { 1 2 "add" } def currentdict "test" get "add" in end',
      expect: 'true'
    }, {
      src: 'dict begin "test" { 1 2 add } def currentdict "test" get "add" in end',
      expect: 'false'
    }],
    'fails with StackUnderflow on insufficient stack': [{
      src: 'in',
      error: StackUnderflow
    }, {
      src: '1 in',
      error: StackUnderflow
    }],
    'fails with TypeCheck if container is not an array, a dict, a block or a proc': {
      src: 'mark 1 in',
      error: TypeCheck
    },
    'fails with TypeCheck if container is a dict but name is not a string': {
      src: 'dict 1 in',
      error: TypeCheck
    }
  })
})
