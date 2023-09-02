import { Break, InvalidBreak, RangeCheck } from '@errors'
import { wrapError } from './error'

describe('state/error', () => {
  it('converts a Break error into an invalidBreak one', () => {
    let error: Error | undefined
    try {
      const internalError = new Break()
      internalError.callstack = 'test'
      wrapError(internalError)
    } catch (e) {
      if (!(e instanceof Error)) {
        throw new Error('Should get an Error')
      }
      error = e
    }
    expect(error).not.toBeUndefined()
    if (error !== undefined) {
      expect(error).not.toBeInstanceOf(Break)
      expect(error).not.toBeInstanceOf(InvalidBreak)
      expect(error.name).toStrictEqual('InvalidBreak')
      expect(error.stack).toStrictEqual('test')
    }
  })

  it('does not let an InternalError out because memory cannot be controlled (and they are not documented)', () => {
    let error: Error | undefined
    try {
      const internalError = new RangeCheck()
      internalError.callstack = 'test'
      wrapError(internalError)
    } catch (e) {
      if (!(e instanceof Error)) {
        throw new Error('Should get an Error')
      }
      error = e
    }
    expect(error).not.toBeUndefined()
    if (error !== undefined) {
      expect(error).not.toBeInstanceOf(RangeCheck)
      expect(error.name).toStrictEqual('RangeCheck')
      expect(error.stack).toStrictEqual('test')
    }
  })
})
