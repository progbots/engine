import { UnmatchedMark } from '@errors'
import { executeStateTests } from '@test/state/execute'
import { Value, ValueType, checkArrayValue } from '@api'
import { IInternalState } from '@sdk'

// test-for ../open-close-helper.ts
// test-for open-array.ts

describe('operators/array/close-array (])', () => {
  executeStateTests({
    'creates an array': {
      src: '1 2 [ 3 4 ]',
      expect: ({ operands }: IInternalState) => {
        expect(operands.length).toStrictEqual(3)
        const operand = operands.ref[0]
        checkArrayValue(operand)
        const { array } = operand
        expect(array.length).toStrictEqual(2)
        expect(array.at(0)).toStrictEqual<Value>({
          type: ValueType.integer,
          number: 3
        })
        expect(array.at(1)).toStrictEqual<Value>({
          type: ValueType.integer,
          number: 4
        })
      }
    },
    'evaluates calls during the array creation': {
      src: '1 2 [ 3 4 add ] aload',
      expect: '1 2 7'
    },
    'keeps debug info from the opening bracket': {
      src: '[ ]',
      expect: ({ operands }: IInternalState) => {
        const value = operands.ref[0]
        checkArrayValue(value)
        const { debug } = value
        expect(debug?.filename).toStrictEqual('test-src.ps')
        expect(debug?.pos).toStrictEqual(0)
      }
    },
    'fails with UnmatchedMark if the stack does not contain a mark': {
      src: '3 4 ]',
      error: UnmatchedMark
    }
  })
})
