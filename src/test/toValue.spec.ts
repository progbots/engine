import { StringValue, Value, ValueType } from '@api'
import { toValue } from './toValue'
import { CycleResult } from '@sdk'

describe('test/toValue', () => {
  it('converts string to StringValue', () => {
    expect(toValue('hello')).toStrictEqual<StringValue>({
      type: ValueType.string,
      string: 'hello'
    })
  })

  it('converts number to IntegerValue', () => {
    expect(toValue(1)).toStrictEqual<Value>({
      type: ValueType.integer,
      number: 1
    })
  })

  it('converts function to OperatorValue', () => {
    const func = (): CycleResult => null
    expect(toValue(func)).toStrictEqual<Value>({
      type: ValueType.operator,
      operator: func
    })
  })
})
