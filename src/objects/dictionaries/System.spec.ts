import { OperatorValue, ValueType } from '@api'
import { InvalidAccess } from '@errors'
import { scanIWritableDictionary } from '@sdk'
import { clear } from '@operators/operandstack/clear'
import { index } from '@operators/operandstack/index-op'
import { SystemDictionary } from './System'

jest.mock('@operators', () => ({
  clear,
  index
}))

describe('objects/dictionaries/System', () => {
  const context = new SystemDictionary()

  it('is read-only', () => {
    expect(() => scanIWritableDictionary(context)).toThrowError(InvalidAccess)
  })

  it('returns null on unknown name', () => {
    expect(context.lookup('unknown_name')).toStrictEqual(null)
  })

  describe('implemented names', () => {
    const expectedOperators = [clear, index]

    expectedOperators.forEach(operator => {
      const name = operator.name
      it(`returns ${name} operator`, () => {
        expect(context.lookup(name)).toStrictEqual<OperatorValue>({
          type: ValueType.operator,
          operator
        })
      })
    })
  })
})
