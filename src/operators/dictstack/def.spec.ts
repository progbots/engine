import { StackUnderflow, TypeCheck } from '../../src/errors/index'
import { State } from '../../state/index'
import { executeTests, SOURCE_FILE } from '../../src/test-helpers'

describe('operators/dictstack/def', () => {
  executeTests({
    'sets a value on the top dictionary': {
      src: 'dict begin "test" 42 def test end',
      expect: '42'
    },
    'sets a procedure on the top dictionary': {
      src: 'dict begin "test" { 1 2 add } def test end',
      expect: '3'
    },
    'keeps debug information on proc': {
      keepDebugInfo: true,
      src: 'dict begin "test" { 1 } def currentdict "test" get end',
      expect: ({ operands }: State) => {
        const [testProc] = operands.ref
        expect(testProc.sourceFile).toStrictEqual(SOURCE_FILE)
        expect(testProc.sourcePos).not.toBeUndefined()
        expect(testProc.sourcePos).not.toStrictEqual(0)
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
