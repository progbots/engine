import { ValueType, checkBlockValue } from '@api'
import { CycleResult, IInternalState, getDebugInfos } from '@sdk'
import { UnmatchedMark } from '@errors'
import { executeStateTests } from '@test/state/execute'

// test-for ../open-close-helper.ts

describe('operators/flow/close-block (})', () => {
  executeStateTests({
    'creates a block': {
      host: {
        addCall: function ({ operands }: IInternalState): CycleResult {
          operands.push({
            type: ValueType.call,
            call: 'add'
          })
          return null
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
      expect: ({ operands }: IInternalState) => {
        const block = operands.ref[0]
        checkBlockValue(block)
        const { filename, pos } = getDebugInfos(block) ?? {}
        expect(filename).toStrictEqual('test-src.ps')
        expect(pos).toStrictEqual(0)
      }
    },
    'fails with UnmatchedMark if the stack does not contain a mark': {
      src: '3 4 }',
      error: UnmatchedMark
    }
  })
})
