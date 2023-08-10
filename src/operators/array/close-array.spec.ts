import { UnmatchedMark } from '../../src/errors/index'
import { executeTests } from '../../src/test-helpers'
import { ValueType } from '../../index'
import { State, checkIArray } from '../../state/index'

// test-for ../open-close-helper.ts
// test-for open-array.ts

describe('operators/array/close-array (])', () => {
  executeTests({
    'creates an array': {
      src: '1 2 [ 3 4 ]',
      expect: ({ operands }: State) => {
        expect(operands.length).toStrictEqual(3)
        const { type, data } = operands.ref[0]
        expect(type).toStrictEqual(ValueType.array)
        checkIArray(data)
        expect(data.length).toStrictEqual(2)
        expect(data.at(0).data).toStrictEqual(3)
        expect(data.at(1).data).toStrictEqual(4)
      }
    },
    'evaluates calls during the array creation': {
      src: '1 2 [ 3 4 add ] aload',
      expect: '1 2 7'
    },
    'keeps debug info from the opening bracket': {
      src: '[ ]',
      keepDebugInfo: true,
      expect: ({ operands }: State) => {
        const { type, sourceFile, sourcePos } = operands.ref[0]
        expect(type).toStrictEqual(ValueType.array)
        expect(sourceFile).toStrictEqual('test-src.ps')
        expect(sourcePos).toStrictEqual(0)
      }
    },
    'fails with UnmatchedMark if the stack does not contain a mark': {
      src: '3 4 ]',
      error: UnmatchedMark
    }
  })
})
