import { UnmatchedMark } from '../errors/index'
import { executeTests } from '../test-helpers'
import { ValueType } from '../index'
import { State } from '../state/index'

// test-for open-close-helper.ts

describe('operators/close-block (})', () => {
  executeTests({
    'creates a block': {
      host: {
        addCall: function * ({ operands }: State): Generator {
          operands.push({
            type: ValueType.call,
            data: 'add'
          })
        }
      },
      src: '{ 3 4 add } aload',
      expect: '3 4 addCall'
    },
    'handles block inside block': {
      src: 'true { false { 1 } { 2 } ifelse } if',
      expect: '2'
    },
    'enables back call execution': {
      src: 'mark { add } 3 4 add counttomark',
      expect: '7 2'
    },
    'keeps debug info from the opening bracket': {
      src: '{ }',
      keepDebugInfo: true,
      expect: ({ operands }: State) => {
        const { type, sourceFile, sourcePos } = operands.ref[0]
        expect(type).toStrictEqual(ValueType.block)
        expect(sourceFile).toStrictEqual('test-src.ps')
        expect(sourcePos).toStrictEqual(0)
      }
    },
    'fails with UnmatchedMark if the stack does not contain a mark': {
      src: '3 4 }',
      error: UnmatchedMark
    }
  })
})
