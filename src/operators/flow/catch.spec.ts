import { StackUnderflow, TypeCheck, Undefined } from '@errors'
import { CycleResult, IInternalState } from '@sdk'
import { executeStateTests } from '@test/state/execute'

class Fail extends Error {}

describe('operators/flow/catch', () => {
  executeStateTests({
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
    'enables to throw an error in the catch block': {
      src: '{ 1 stackunderflow 2 } { "name" get 3 undefined 4 } catch',
      error: Undefined,
      expect: '1 "StackUnderflow" 3'
    },
    'does not catch non managed exceptions': {
      host: {
        fail: function (state: IInternalState): CycleResult {
          throw new Fail()
        }
      },
      src: '{ 1 fail } { pop 2 } catch',
      error: Fail,
      expect: '1'
    },
    'fails with StackUnderflow on a stack with only one block': {
      src: '{ } catch',
      error: StackUnderflow
    },
    'fails with TypeCheck if the operands are not block': [{
      src: '{ } "not_a_proc" catch',
      error: TypeCheck
    }, {
      src: '"not_a_proc" { } catch',
      error: TypeCheck
    }]
  })
})
