import { ValueType } from '..'
import { Dictionary } from '../objects/dictionaries'
import { MemoryTracker } from '../state/MemoryTracker'
import { Custom } from './Custom'
import { TypeCheck } from './TypeCheck'

describe('errors/Custom', () => {
  let tracker: MemoryTracker
  let dict: Dictionary

  beforeAll(() => {
    tracker = new MemoryTracker()
  })

  beforeEach(() => {
    dict = new Dictionary(tracker)
  })

  afterEach(() => {
    if (dict.refCount > 0) {
      dict.release()
    }
  })

  it('detect missing properties (name)', () => {
    dict.def('message', {
      type: ValueType.string,
      data: 'message'
    })
    expect(() => new Custom(dict)).toThrowError(TypeCheck)
  })

  it('detect invalid property (name)', () => {
    dict.def('name', {
      type: ValueType.integer,
      data: 1
    })
    dict.def('message', {
      type: ValueType.string,
      data: 'message'
    })
    expect(() => new Custom(dict)).toThrowError(TypeCheck)
  })

  it('detect missing properties (message)', () => {
    dict.def('name', {
      type: ValueType.string,
      data: 'name'
    })
    expect(() => new Custom(dict)).toThrowError(TypeCheck)
  })

  it('detect invalid property (message)', () => {
    dict.def('name', {
      type: ValueType.string,
      data: 'name'
    })
    dict.def('message', {
      type: ValueType.integer,
      data: 1
    })
    expect(() => new Custom(dict)).toThrowError(TypeCheck)
  })

  describe('on a valid dictionary', () => {
    let custom: Custom

    beforeEach(() => {
      dict.def('name', {
        type: ValueType.string,
        data: 'name'
      })
      dict.def('message', {
        type: ValueType.string,
        data: 'message'
      })

      custom = new Custom(dict)
    })

    it('gives access to the dictionary', () => {
      expect(custom.dictionary).toStrictEqual(dict)
    })

    describe('IWritableDictionary', () => {
      it('list the existing names', () => {
        expect(custom.names).toStrictEqual([
          'name',
          'message'
        ])
      })

      it('enables lookup', () => {
        expect(custom.lookup('name')).toStrictEqual({
          type: ValueType.string,
          data: 'name'
        })
      })

      it('enables the modification of the dictionary', () => {
        custom.def('test', {
          type: ValueType.string,
          data: 'test'
        })
        expect(dict.lookup('test')).toStrictEqual({
          type: ValueType.string,
          data: 'test'
        })
      })
    })

    it('releases the dictionary', () => {
      custom.release()
      expect(dict.refCount).toStrictEqual(0)
    })
  })
})
