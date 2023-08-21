import * from '@api'

describe('@api', () => {
  it('contains API types', () => {
    const value: Value = {
      type: ValueType.string,
      string: 'abc'
    }
    expect(value).toStrictEqual(value)
  })
})
