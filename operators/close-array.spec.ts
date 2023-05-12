import { UnmatchedMark } from '../errors/index'
import { executeTests } from '../test-helpers'
import { IArray, ValueType } from '../index'
import { State } from '../state/index'

// test-for open-close-helper.ts
// test-for open-array.ts

describe('operators/close-array (])', () => {
  executeTests({
    'creates an array': {
      src: '1 2 [ 3 4 ]',
      expect: ({ operands }: State) => {
        expect(operands.length).toStrictEqual(3)
        const { type, data } = operands.ref[0]
        expect(type).toStrictEqual(ValueType.array)
        const array = data as IArray
        expect(array.length).toStrictEqual(2)
        expect(array.at(0).data).toStrictEqual(3)
        expect(array.at(1).data).toStrictEqual(4)
      }
    },
    'evaluates calls during the array creation': {
      src: '1 2 [ 3 4 add ] aload',
      expect: '1 2 7'
    },
    'fails with UnmatchedMark if the stack does not contain a mark': {
      src: '3 4 ]',
      error: UnmatchedMark
    }
  })
})
