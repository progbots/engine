import { Value, checkStringValue } from '@api'
import { BaseError } from './BaseError'

describe('errors/BaseError', () => {
  describe('behaves like an Error', () => {
    let error: BaseError

    beforeAll(() => {
      error = new BaseError('test')
    })

    it('exposes name', () => {
      expect(error.name).toStrictEqual('BaseError')
    })

    it('exposes message', () => {
      expect(error.message).toStrictEqual('test')
    })

    it('exposes stack', () => {
      expect(error.stack).not.toBeUndefined()
    })
  })

  describe('behaves like a Dictionary', () => {
    let error: BaseError

    beforeAll(() => {
      error = new BaseError('test')
    })

    it('exposes names', () => {
      expect(error.names).toStrictEqual([
        'type',
        'name',
        'message',
        'stack'
      ])
    })

    function checkNonNull (value: Value | null): asserts value is Value {
      if (value === null) {
        throw new Error('Unexpected null value')
      }
    }

    it('exposes type', () => {
      const typeValue = error.lookup('type')
      checkNonNull(typeValue)
      checkStringValue(typeValue)
      expect(typeValue.string).toStrictEqual('system')
    })

    it('exposes name', () => {
      const nameValue = error.lookup('name')
      checkNonNull(nameValue)
      checkStringValue(nameValue)
      expect(nameValue.string).toStrictEqual('BaseError')
    })

    it('exposes message', () => {
      const messageValue = error.lookup('message')
      checkNonNull(messageValue)
      checkStringValue(messageValue)
      expect(messageValue.string).toStrictEqual('test')
    })

    it('exposes stack', () => {
      const stackValue = error.lookup('stack')
      checkNonNull(stackValue)
      checkStringValue(stackValue)
      expect(stackValue.string).toContain('BaseError.spec.ts')
    })

    it('returns null on any other property', () => {
      expect(error.lookup('unknown')).toBeNull()
    })
  })

  describe('callstack', () => {
    it('maps default stack', () => {
      const error = new BaseError('test')
      const { callstack } = error
      expect(callstack).not.toContain('BaseError:')
      expect(callstack).toContain('BaseError.spec.ts')
    })

    it('always return a string', () => {
      const error = new BaseError('test')
      error.stack = undefined
      expect(error.callstack).toStrictEqual('')
    })

    it('offers a setter', () => {
      const error = new BaseError('test')
      error.callstack = 'abc'
      expect(error.callstack).toStrictEqual('abc')
    })

    it('can only be set once', () => {
      const error = new BaseError('test')
      error.callstack = 'abc'
      error.callstack = 'def'
      expect(error.callstack).toStrictEqual('abc')
    })
  })
})
