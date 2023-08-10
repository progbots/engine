import { StackUnderflow, TypeCheck } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'

describe('operators/flow/ifelse', () => {
  executeTests({
    'evaluates if block if true': {
      src: '0 true { 42 } { -1 } ifelse',
      expect: '0 42'
    },
    'evaluates else block if true': {
      src: '0 false { -1 } { 42 } ifelse',
      expect: '0 42'
    },
    'fails with StackUnderflow on insufficient stack': [{
      src: 'ifelse',
      error: StackUnderflow
    }, {
      src: '{ } ifelse',
      error: StackUnderflow
    }, {
      src: '{ } { } ifelse',
      error: StackUnderflow
    }],
    'fails with TypeCheck on invalid signature': [{
      src: 'true "if" "else" ifelse',
      error: TypeCheck
    }, {
      src: 'true { } "else" ifelse',
      error: TypeCheck
    }, {
      src: 'true "if" { } ifelse',
      error: TypeCheck
    }, {
      src: '0 { } { } ifelse',
      error: TypeCheck
    }]
  })
})
