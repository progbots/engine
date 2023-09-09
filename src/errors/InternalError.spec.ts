import { InternalError } from './InternalError'

describe('errors/InternalError', () => {
  let error: InternalError

  beforeAll(() => {
    error = new InternalError('message')
  })

  it('forbids the callstack override', () => {
    error.callstack = 'NOPE'
    expect(error.callstack).not.toStrictEqual('NOPE')
  })
})
