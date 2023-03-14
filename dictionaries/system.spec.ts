import { SystemDictionary } from './system'
import { ValueType } from '../types'
import { InvalidAccess } from '../errors'
import { add, index, sub } from '../operators'

describe('contexts/root', () => {
  const context = new SystemDictionary()

  it('is read-only', () => {
    expect(() => context.def('test', {
      type: ValueType.integer,
      data: 1
    })).toThrowError(InvalidAccess)
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
