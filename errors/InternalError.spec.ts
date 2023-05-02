import { ValueType } from '..'
import { InternalError } from './InternalError'

describe('errors/InternalError', () => {
  describe('behaves like an Error', () => {
    let error: InternalError

    beforeAll(() => {
      error = new InternalError('test')
    })

    it('exposes name', () => {
      expect(error.name).toStrictEqual('InternalError')
    })

    it('exposes message', () => {
      expect(error.message).toStrictEqual('test')
    })

    it('exposes stack', () => {
      expect(error.stack).not.toBeUndefined()
    })
  })

  describe('behaves like a Dictionary', () => {
    let error: InternalError

    beforeAll(() => {
      error = new InternalError('test')
    })

    it('exposes names', () => {
      expect(error.names).toStrictEqual([
        'type',
        'name',
        'message',
        'stack'
      ])
    })

    it('exposes type', () => {
      expect(error.lookup('type')).toStrictEqual({
        type: ValueType.string,
        data: 'system'
      })
    })

    it('exposes name', () => {
      expect(error.lookup('name')).toStrictEqual({
        type: ValueType.string,
        data: 'InternalError'
      })
    })

    it('exposes message', () => {
      expect(error.lookup('message')).toStrictEqual({
        type: ValueType.string,
        data: 'test'
      })
    })

    it('exposes stack', () => {
      const stackValue = error.lookup('stack')
      if (stackValue === null) {
        throw new Error('Unexpected null stack')
      }
      expect(stackValue).toStrictEqual({
        type: ValueType.string,
        data: expect.anything()
      })
      expect(stackValue.data).toContain('InternalError.spec.ts')
    })

    it('returns null on any other property', () => {
      expect(error.lookup('unknown')).toBeNull()
    })
  })

  describe('callstack', () => {
    it('maps default stack', () => {
      const error = new InternalError('test')
      const { callstack } = error
      expect(callstack).not.toContain('InternalError:')
      expect(callstack).toContain('InternalError.spec.ts')
    })

    it('offers a setter', () => {
      const error = new InternalError('test')
      error.callstack = 'abc'
      expect(error.callstack).toStrictEqual('abc')
    })

    it('can only be set once', () => {
      const error = new InternalError('test')
      error.callstack = 'abc'
      error.callstack = 'def'
      expect(error.callstack).toStrictEqual('abc')
    })
  })
})
