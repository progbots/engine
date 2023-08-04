import { IArray, IDictionary, Value, ValueType } from '../index'
import { VMError } from '../errors/index'
import { ShareableObject } from '../objects/ShareableObject'
import { MemoryTracker } from './MemoryTracker'

class MyObject extends ShareableObject {
  public disposeCalled: number = 0

  protected _dispose (): void {
    ++this.disposeCalled
  }
}

class MyArray extends MyObject implements IArray {
  get length (): number { return 0 }
  at (index: number): Value { return { type: ValueType.integer, data: index } }
}

class MyDictionary extends MyObject implements IDictionary {
  get names (): string[] { return [] }
  lookup (name: string): Value { return { type: ValueType.string, data: name } }
}

describe('state/MemoryTracker', () => {
  describe('initial state', () => {
    it('starts with used being 0', () => {
      const tracker = new MemoryTracker()
      expect(tracker.used).toStrictEqual(0)
    })
  })

  describe('integer data type', () => {
    let integerValueSize: number
    const integer: Value = {
      type: ValueType.integer,
      data: 1
    }

    beforeEach(() => {
      const tracker = new MemoryTracker()
      tracker.addValueRef(integer)
      integerValueSize = tracker.used
    })

    it('counts bytes for the value', () => {
      expect(integerValueSize).not.toStrictEqual(0)
    })

    it('sums up bytes', () => {
      const tracker = new MemoryTracker()
      tracker.addValueRef(integer)
      tracker.addValueRef(integer)
      expect(tracker.used).toStrictEqual(2 * integerValueSize)
      expect(tracker.peak).toStrictEqual(2 * integerValueSize)
    })

    it('frees bytes', () => {
      const tracker = new MemoryTracker()
      tracker.addValueRef(integer)
      tracker.releaseValue(integer)
      expect(tracker.used).toStrictEqual(0)
      expect(tracker.peak).toStrictEqual(integerValueSize)
    })
  })

  describe('string management', () => {
    describe('small strings', () => {
      const string: Value = {
        type: ValueType.string,
        data: 'small'
      }
      const expectedSize = MemoryTracker.VALUE_SIZE + 6

      it('counts small string size', () => {
        const tracker = new MemoryTracker()
        tracker.addValueRef(string)
        expect(tracker.used).toStrictEqual(expectedSize)
      })

      it('sums up bytes', () => {
        const tracker = new MemoryTracker()
        tracker.addValueRef(string)
        tracker.addValueRef(string)
        expect(tracker.used).toStrictEqual(2 * expectedSize)
        expect(tracker.peak).toStrictEqual(2 * expectedSize)
      })

      it('frees bytes', () => {
        const tracker = new MemoryTracker()
        tracker.addValueRef(string)
        tracker.releaseValue(string)
        expect(tracker.used).toStrictEqual(0)
        expect(tracker.peak).toStrictEqual(expectedSize)
      })
    })

    describe('reference counts big strings', () => {
      const value: Value = {
        type: ValueType.string,
        data: ''.padStart(MemoryTracker.CACHABLE_STRING_LENGTH, 'abcdef')
      }
      const expectedSize = MemoryTracker.VALUE_SIZE + MemoryTracker.INTEGER_SIZE + MemoryTracker.CACHABLE_STRING_LENGTH + 1
      let tracker: MemoryTracker
      let initial: number

      beforeEach(() => {
        tracker = new MemoryTracker()
        initial = tracker.used
        tracker.addValueRef(value) // 1
      })

      it('stores string in a buffer', () => {
        expect(tracker.used).toStrictEqual(expectedSize)
      })

      it('does not duplicate string if already reference counted', () => {
        tracker.addValueRef(value) // 2
        expect(tracker.used).toStrictEqual(expectedSize + MemoryTracker.VALUE_SIZE)
        expect(tracker.peak).toStrictEqual(expectedSize + MemoryTracker.VALUE_SIZE)
      })

      it('does not free memory until removed the right number of times', () => {
        tracker.addValueRef(value) // 2
        tracker.releaseValue(value) // 1
        expect(tracker.used).toStrictEqual(expectedSize)
        expect(tracker.peak).toStrictEqual(expectedSize + MemoryTracker.VALUE_SIZE)
      })

      it('frees memory on last release', () => {
        tracker.addValueRef(value) // 2
        tracker.releaseValue(value) // 1
        tracker.releaseValue(value) // 0
        expect(tracker.used).toStrictEqual(initial)
        expect(tracker.peak).toStrictEqual(expectedSize + MemoryTracker.VALUE_SIZE)
      })
    })

    describe('untracked', () => {
      it('does not track memory allocated to the string', () => {
        const tracker = new MemoryTracker()
        const initial = tracker.used
        tracker.addValueRef({
          type: ValueType.string,
          data: ''.padStart(MemoryTracker.CACHABLE_STRING_LENGTH, 'abcdef'),
          untracked: true
        })
        expect(tracker.used - initial).toStrictEqual(MemoryTracker.VALUE_SIZE)
      })
    })
  })

  describe('shareable object management', () => {
    const types: Array<ValueType.array | ValueType.block | ValueType.proc | ValueType.dict> = [ValueType.array, ValueType.block, ValueType.proc, ValueType.dict]

    types.forEach(type => {
      describe(type, () => {
        let object: MyArray | MyDictionary
        let tracker: MemoryTracker
        let value: Value

        beforeEach(() => {
          tracker = new MemoryTracker()
          if (type === ValueType.dict) {
            object = new MyDictionary()
            value = {
              type,
              data: object
            }
          } else {
            object = new MyArray()
            value = {
              type,
              data: object
            }
          }
        })

        it('increments reference count on addValueRef', () => {
          tracker.addValueRef(value)
          expect(object.refCount).toStrictEqual(2)
        })

        it('decrements reference count on releaseValue', () => {
          tracker.releaseValue(value)
          expect(object.refCount).toStrictEqual(0)
          expect(object.disposeCalled).toStrictEqual(1)
        })

        it('ignores if untracked', () => {
          tracker.addValueRef({
            ...value,
            untracked: true
          })
          expect(object.refCount).toStrictEqual(1)
          tracker.releaseValue({
            ...value,
            untracked: true
          })
          expect(object.refCount).toStrictEqual(1)
        })
      })
    })
  })

  describe('VMerror', () => {
    it('does not raise an error when the limit is not exceeded', () => {
      const tracker = new MemoryTracker(10)
      expect(() => tracker.increment(10)).not.toThrowError(VMError)
    })

    it('raises an error if limit is exceeded', () => {
      const tracker = new MemoryTracker(10)
      expect(() => tracker.increment(11)).toThrowError(VMError)
    })
  })
})
