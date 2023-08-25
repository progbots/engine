import { ValueType } from '@api'
import { InvalidAccess } from '@errors'
import { scanIWritableDictionary } from '@sdk'
import { add, index, sub } from '@operators'
import { SystemDictionary } from './System'

describe('objects/dictionaries/System', () => {
  const context = new SystemDictionary()

  it('is read-only', () => {
    expect(() => scanIWritableDictionary(context)).toThrowError(InvalidAccess)
  })

  it('returns null on unknown name', () => {
    expect(context.lookup('unknown_name')).toStrictEqual(null)
  })

  describe('implemented names', () => {
    const expectedOperators = [add, index, sub]

    expectedOperators.forEach(operator => {
      const name = operator.name
      it(`returns ${name} operator`, () => {
        expect(context.lookup(name)).toStrictEqual({
          type: ValueType.operator,
          data: operator
        })
      })
    })
  })
})
