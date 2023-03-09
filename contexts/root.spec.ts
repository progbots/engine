import { RootContext } from './root'
import { ValueType } from '../types'
import { InvalidAccess } from '../errors'
import { add, index, sub } from '../operators'

describe('contexts/root', () => {
  const context = new RootContext()

  it('is read-only', () => {
    expect(() => context.def('test', {
      type: ValueType.number,
      data: 1
    })).toThrowError(InvalidAccess)
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
