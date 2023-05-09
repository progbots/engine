import { UnmatchedMark } from '../errors/index'
import { executeTests } from '../test-helpers'
import { ValueType } from '../index'
import { State } from '../state/index'

// test-for open-close-helper.ts

describe('operators/close-proc (})', () => {
  executeTests({
    'creates a proc': {
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
    'handles proc inside proc': {
      src: 'true { false { 1 } { 2 } ifelse } if',
      expect: '2'
    },
    'enables back call execution': {
      src: 'mark { add } 3 4 add countomark',
      expect: '7 2'
    },
    'fails with UnmatchedMark if the stack does not contain a mark': {
      src: '3 4 }',
      error: UnmatchedMark
    }
  })
})
