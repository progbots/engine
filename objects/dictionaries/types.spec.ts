import { IDictionary } from '../..'
import { InvalidAccess } from '../../errors'
import { MemoryTracker } from '../../state/MemoryTracker'
import { Dictionary } from './Dictionary'
import { SystemDictionary } from './System'
import { checkIWritableDictionary } from './types'

describe('objects/dictionaries/types', () => {
  it('validates if the dictionary is read-only', () => {
    const system = new SystemDictionary()
    expect(() => checkIWritableDictionary(system)).toThrowError(InvalidAccess)
  })

  it('validates if the dictionary is read/write', () => {
    const tracker = new MemoryTracker()
    const dict = new Dictionary(tracker)
    expect(() => checkIWritableDictionary(dict)).not.toThrowError()
  })

  describe('validating the def function signature', () => {
    let dict: IDictionary & { def?: any }

    beforeEach(() => {
      dict = new SystemDictionary()
    })

    afterEach(() => {
      expect(() => checkIWritableDictionary(dict)).toThrowError(InvalidAccess)
    })

    it('must be a function', () => {
      dict.def = 1
    })

    it('must accept two parameters', () => {
      dict.def = () => {}
    })

    it('must accept two parameters only', () => {
      dict.def = function (a: number, b: number, c: number): number { return a + b + c }
    })
  })
})
