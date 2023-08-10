import { SystemDictionary } from './System'
import { ValueType } from '../../index'
import { InvalidAccess } from '../../errors/index'
import { add, index, sub } from '../../operators'
import { checkIWritableDictionary } from './types'

describe('objects/dictionaries/System', () => {
  const context = new SystemDictionary()

  it('is read-only', () => {
    expect(() => checkIWritableDictionary(context)).toThrowError(InvalidAccess)
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
