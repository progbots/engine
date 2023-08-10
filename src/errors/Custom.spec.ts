import { Value, ValueType } from '../index'
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
      string: 'message'
    })
    expect(() => new Custom(dict)).toThrowError(TypeCheck)
  })

  it('detect invalid property (name)', () => {
    dict.def('name', {
      type: ValueType.integer,
      number: 1
    })
    dict.def('message', {
      type: ValueType.string,
      string: 'message'
    })
    expect(() => new Custom(dict)).toThrowError(TypeCheck)
  })

  it('detect missing properties (message)', () => {
    dict.def('name', {
      type: ValueType.string,
      string: 'name'
    })
    expect(() => new Custom(dict)).toThrowError(TypeCheck)
  })

  it('detect invalid property (message)', () => {
    dict.def('name', {
      type: ValueType.string,
      string: 'name'
    })
    dict.def('message', {
      type: ValueType.integer,
      number: 1
    })
    expect(() => new Custom(dict)).toThrowError(TypeCheck)
  })

  describe('on a valid dictionary', () => {
    let custom: Custom

    beforeEach(() => {
      dict.def('name', {
        type: ValueType.string,
        string: 'name'
      })
      dict.def('message', {
        type: ValueType.string,
        string: 'message'
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
        const expectedName: Value = {
          type: ValueType.string,
          string: 'name'
        }
        expect(custom.lookup('name')).toStrictEqual(expectedName)
      })

      it('enables the modification of the dictionary', () => {
        const expectedTest: Value = {
          type: ValueType.string,
          string: 'test'
        }
        custom.def('test', expectedTest)
        expect(dict.lookup('test')).toStrictEqual(expectedTest)
      })
    })

    it('releases the dictionary', () => {
      custom.release()
      expect(dict.refCount).toStrictEqual(0)
    })
  })
})
