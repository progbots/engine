import { InvalidAccess, StackUnderflow, TypeCheck } from '../../errors/index'
import { InternalValue, State } from '../../state/index'
import { ArrayLike } from '../../objects/Array'
import { executeTests } from '../../test-helpers'

describe('operators/dictstack/bind', () => {
  executeTests({
    'replaces block calls with their callees': {
      src: '{ true [ 42 ] "unchanged" } bind aload',
      expect: `systemdict "true" get
               systemdict "[" get
               42
               systemdict "]" get
               "unchanged"
              `
    },
    // TODO: decide if we want to go down this rabbit hole
    // 'replaces proc calls with their callees': {
    //   src: `dict begin
    //         "test" {
    //           true [ 42 ] "unchanged"
    //         } def
    //         currentdict "test" get
    //         bind
    //         aload
    //         end
    //        `,
    //   expect: `systemdict "true" get
    //            systemdict "[" get
    //            42
    //            systemdict "]" get
    //            "unchanged"
    //           `
    // },
    'replaces block recursively': {
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
    'should not ignore errors': {
      host: {
        asro: function * ({ operands }: State): Generator {
          const value = operands.ref[0]
          const block = value.data as unknown as ArrayLike
          block.set = function (index: number, value: InternalValue): void {
            throw new InvalidAccess()
          }
        }
      },
      src: '{ add } asro bind',
      error: InvalidAccess
    },
    'fails with StackUnderflow on empty stack': {
      src: 'bind',
      error: StackUnderflow
    },
    'fails with TypeCheck if the parameter is not a block': {
      src: '0 bind',
      error: TypeCheck
    }
  })
})
