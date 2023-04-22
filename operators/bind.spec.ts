import { StackUnderflow, TypeCheck } from '../errors/index'
import { executeTests } from '../test-helpers'

describe('operators/bind', () => {
  executeTests({
    'replaces proc calls with their callees': {
      src: '{ true [ 42 ] "unchanged" } bind aload',
      expect: `systemdict "true" get
               systemdict "[" get
               42
               systemdict "]" get
               "unchanged"
              `
    },
    'replaces proc recursively': {
      src: `{ { true } { false } ifelse } bind aload
            3 1 roll aload
            3 1 roll aload
            3 1 roll
           `,
      expect: `systemdict "true" get
               systemdict "false" get
               systemdict "ifelse" get
              `
    },
    'should not fail if a call cannot be bound yet': {
      src: '{ test } bind aload',
      expect: '{ test } aload'
    },
    'fails with StackUnderflow on empty stack': {
      src: 'bind',
      error: StackUnderflow
    },
    'fails with TypeCheck if the parameter is not a proc': {
      src: '0 bind',
      error: TypeCheck
    }
  })
})
