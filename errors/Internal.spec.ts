import { Internal } from './Internal'

describe('errors/Internal', () => {
  let error: Internal

  beforeAll(() => {
    error = new Internal('message')
  })

  it('forbids the callstack override', () => {
    error.callstack = 'NOPE'
    expect(error.callstack).not.toStrictEqual('NOPE')
  })
})
