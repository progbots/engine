import { IArray, Value, ValueType } from '../index'
import { checkBlockValue, checkBooleanValue, isBlockValue, isBooleanValue } from './types'

interface checkParameters {
  name: string
  type: ValueType
  check: (value: any) => void
  is: (value: any) => boolean
  ok: any[]
  ko: any[]
}

function check ({ name, type, check, is, ok, ko }: checkParameters): void {
  describe(name, () => {
    ok
      .forEach(data => {
        const value = {
          type,
          data
        }
        const valueAsString = JSON.stringify(value)
        it(`validates ${valueAsString} (check)`, () => {
          expect(() => check(value)).not.toThrowError()
        })
        it(`validates ${valueAsString} (is)`, () => {
          expect(is(value)).toStrictEqual(true)
        })
      })
    const invalidData = [
      null,
      true, false,
      -1, 0, 1,
      '', 'hello world !'
    ]
    invalidData
      .filter(data => !ok.includes(data))
      .map(data => ({
        type,
        data
      }))
      .concat(ko)
      .forEach(value => {
        const valueAsString = JSON.stringify(value)
        it(`invalidates ${valueAsString} (check)`, () => {
          expect(() => check(value)).toThrowError()
        })
        it(`invalidates ${valueAsString} (is)`, () => {
          expect(is(value)).toStrictEqual(false)
        })
      })
  })
}

const iarray: IArray = {
  length: 1,
  at (index: number): Value {
    return {
      type: ValueType.integer,
      data: index
    }
  }
}

const notIArrays = [{
  length: -1,
  at (index: number): Value {
    return {
      type: ValueType.integer,
      data: index
    }
  }
}, {
  length: '123',
  at (index: number): Value {
    return {
      type: ValueType.integer,
      data: index
    }
  }
}, {
  at (index: number): Value {
    return {
      type: ValueType.integer,
      data: index
    }
  }
}, {
  length: 1,
  at (): void { }
}, {
}]

describe('state/types', () => {
  check({
    name: 'BooleanValue',
    type: ValueType.boolean,
    check: checkBooleanValue,
    is: isBooleanValue,
    ok: [true, false],
    ko: [{
      type: ValueType.boolean,
      data: {}
    }]
  })

  check({
    name: 'BlockValue',
    type: ValueType.block,
    check: checkBlockValue,
    is: isBlockValue,
    ok: [iarray],
    ko: notIArrays
  })
})
