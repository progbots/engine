import { StackUnderflow, TypeCheck, Undefined } from '../errors/index'
import { executeTests } from '../test-helpers'

describe('operators/catch', () => {
  executeTests({
    'does not execute the catch block if no exception occurred': {
      src: '{ 1 2 } { 3 } catch',
      expect: '1 2'
    },
    'executes the catch block when an exception occurs': {
      src: '{ 1 undefined 2 } { pop 3 } catch',
      expect: '1 3'
    },
    'receives error details': {
      src: '{ 1 undefined 2 } { begin type name end } catch',
      expect: '1 "system" "Undefined"'
    },
    'throws the error in the catch proc': {
      src: '{ 1 stackunderflow 2 } { /name get 3 undefined 4 } catch',
      error: Undefined,
      expect: '1 "StackUnderflow" 3'
    },
    'does not catch non managed exceptions': {
      skip: true,
      // Need to create a host specific function that generates a non managed exception
      src: '',
      expect: ''
    },
    'fails with StackUnderflow on a stack with only one proc': {
      src: '{ } catch',
      error: StackUnderflow
    },
    'fails with TypeCheck if the operands are not proc': [{
      src: '{ } "not_a_proc" catch',
      error: TypeCheck
    }, {
      src: '"not_a_proc" { } catch',
      error: TypeCheck
    }]
  })
})
