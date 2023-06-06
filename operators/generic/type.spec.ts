import { StackUnderflow } from '../../errors/index'
import { executeTests } from '../../test-helpers'

describe('operators/generic/type', () => {
  executeTests({
    'gives type of a boolean': {
      src: '42 true type',
      expect: '42 "booleantype"'
    },
    'gives type of an integer': {
      src: '1 type',
      expect: '"integertype"'
    },
    'gives type of a string': {
      src: '"string" type',
      expect: '"stringtype"'
    },
    'gives type of a call': {
      src: '{ add } 0 get type',
      expect: '"calltype"'
    },
    'gives type of an operator': {
      src: '{ add } bind 0 get type',
      expect: '"operatortype"'
    },
    'gives type of a mark': {
      src: 'mark type',
      expect: '"marktype"'
    },
    'gives type of an array': {
      src: '[ ] type',
      expect: '"arraytype"'
    },
    'gives type of a dictionary': {
      src: 'systemdict type',
      expect: '"dicttype"'
    },
    'gives type of a block': {
      src: '{ } type',
      expect: '"blocktype"'
    },
    'gives type of a proc': {
      src: 'dict begin "test" { } def currentdict "test" get type end',
      expect: '"proctype"'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'type',
      error: StackUnderflow
    }
  })
})
