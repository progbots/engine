import { ValueType } from '@api'
import { StackUnderflow, TypeCheck } from '@errors'
import { IInternalState } from '@sdk'
import { executeStateTests, SOURCE_FILE } from '@test/state/execute'

describe('operators/dictstack/def', () => {
  executeStateTests({
    'sets a value on the top dictionary': {
      src: 'dict begin "test" 42 def test end',
      expect: '42'
    },
    'sets a procedure on the top dictionary': {
      src: 'dict begin "test" { 1 2 add } def test end',
      expect: '3'
    },
    'keeps debug information on proc': {
      src: 'dict begin "test" { 1 } def currentdict "test" get end',
      expect: ({ operands }: IInternalState) => {
        const [{ debug }] = operands.check(ValueType.block)
        if (debug === undefined) {
          throw new Error('missing debug information')
        }
        expect(debug.filename).toStrictEqual(SOURCE_FILE)
        expect(debug.pos).not.toBeUndefined()
        expect(debug.pos).not.toStrictEqual(0)
      }
    },
    'fails with StackUnderflow on empty stack': {
      src: 'def',
      error: StackUnderflow
    },
    'fails with StackUnderflow on a single stack item': {
      src: '1 def',
      error: StackUnderflow
    },
    'fails with TypeCheck if no name is provided': {
      src: '0 1 def',
      error: TypeCheck
    }
  })
})
