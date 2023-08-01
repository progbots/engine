import { ValueType } from '..'
import { checkBooleanValue, isBooleanValue } from './types'

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
    ok.forEach(value => {
      value.type = type
      const valueAsString = JSON.stringify(value)
      it(`validates ${valueAsString} (check)`, () => {
        expect(() => check(value)).not.toThrowError()
      })
      it(`validates ${valueAsString} ()`, () => {
        expect(is(value)).toStrictEqual(true)
      })
    })
  })
}

describe('state/types', () => {
  check({
    name: 'BooleanValue',
    type: ValueType.boolean,
    check: checkBooleanValue,
    is: isBooleanValue,
    ok: [{
      data: true
    }, {
      data: false
    }],
    ko: [{
      type: ValueType.boolean,
      data: null
    }]
  })
})
