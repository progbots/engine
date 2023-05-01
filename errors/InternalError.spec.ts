import { ValueType } from '..'
import { InternalError } from './InternalError'

describe('errors/InternalError', () => {
  it('behaves like an Error', () => {
    const error = new InternalError('test')
    expect(error.name).toStrictEqual('InternalError')
    expect(error.message).toStrictEqual('test')
    expect(error.stack).not.toBeUndefined()
  })

  it('behaves like a Dictionary', () => {
    const error = new InternalError('test')
    expect(error.lookup('type')).toStrictEqual({
      type: ValueType.string,
      data: 'system'
    })
    expect(error.lookup('name')).toStrictEqual({
      type: ValueType.string,
      data: 'InternalError'
    })
    expect(error.lookup('message')).toStrictEqual({
      type: ValueType.string,
      data: 'test'
    })
    expect(error.lookup('stack')).toStrictEqual({
      type: ValueType.string,
      data: expect.anything()
    })
  })

  describe('callstack', () => {
    it('maps default stack', () => {
      const error = new InternalError('test')
      const { callstack } = error
      expect(callstack).not.toContain('InternalError:')
      expect(callstack).toContain('InternalError.spec.ts')
    })
  })
})
