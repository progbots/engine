import { IArray, ValueType } from '../index'
import { VMError } from '../errors/index'
import { ShareableObject } from '../objects/ShareableObject'
import { MemoryTracker } from './MemoryTracker'

class MyObject extends ShareableObject {
  public disposeCalled: number = 0

  protected _dispose (): void {
    ++this.disposeCalled
  }
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

    beforeAll(() => {
      const tracker = new MemoryTracker()
      tracker.addValueRef({
        type: ValueType.integer,
        data: 1
      })
      integerValueSize = tracker.used
    })

    it('counts bytes for the value', () => {
      expect(integerValueSize).not.toStrictEqual(0)
    })

    it('accumulates Value sizes', () => {
      const tracker = new MemoryTracker()
      const value = {
        type: ValueType.integer,
        data: 1
      }
      tracker.addValueRef(value)
      tracker.addValueRef(value)
      expect(tracker.used).toStrictEqual(2 * integerValueSize)
    })
  })

  describe('string management', () => {
    it('counts small string size', () => {
      const tracker = new MemoryTracker()
      tracker.addValueRef({
        type: ValueType.string,
        data: 'small'
      })
      expect(tracker.used).toStrictEqual(MemoryTracker.VALUE_SIZE + 6)
    })

    it('duplicates small strings', () => {
      const tracker = new MemoryTracker()
      tracker.addValueRef({
        type: ValueType.string,
        data: 'small'
      })
      const { used } = tracker
      tracker.addValueRef({
        type: ValueType.string,
        data: 'small'
      })
      expect(tracker.used).toStrictEqual(2 * used)
    })

    describe('reference counts big strings', () => {
      const bigString = ''.padStart(MemoryTracker.CACHABLE_STRING_LENGTH, 'abcdef')
      let tracker: MemoryTracker
      let initial: number
      let addedOnce: number

      beforeAll(() => {
        tracker = new MemoryTracker()
        initial = tracker.used
      })

      it('stores string in a buffer', () => {
        tracker.addValueRef({
          type: ValueType.string,
          data: bigString
        })
        addedOnce = tracker.used
        expect(addedOnce).toBeGreaterThan(initial)
      })

      it('does not duplicate string if already reference counted', () => {
        tracker.addValueRef({
          type: ValueType.string,
          data: bigString
        })
        expect(tracker.used).toBeLessThan(2 * addedOnce)
      })

      it('does not free memory until removed the right number of times', () => {
        tracker.releaseValue({
          type: ValueType.string,
          data: bigString
        })
        expect(tracker.used).toStrictEqual(addedOnce)
      })

      it('frees memory on last release', () => {
        tracker.releaseValue({
          type: ValueType.string,
          data: bigString
        })
        expect(tracker.used).toStrictEqual(initial)
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
    const types = [ValueType.array, ValueType.dict, ValueType.proc]

    types.forEach(type => {
      it(`increments reference count on addValueRef (${type})`, () => {
        const object = new MyObject()
        const tracker = new MemoryTracker()
        tracker.addValueRef({
          type,
          data: object as unknown as IArray
        })
        expect(object.refCount).toStrictEqual(2)
      })

      it(`decrements reference count on releaseValue (${type})`, () => {
        const object = new MyObject()
        const tracker = new MemoryTracker()
        tracker.releaseValue({
          type,
          data: object as unknown as IArray
        })
        expect(object.refCount).toStrictEqual(0)
        expect(object.disposeCalled).toStrictEqual(1)
      })

      it(`ignores if untracked (${type})`, () => {
        const object = new MyObject()
        const tracker = new MemoryTracker()
        tracker.addValueRef({
          type,
          data: object as unknown as IArray,
          untracked: true
        })
        expect(object.refCount).toStrictEqual(1)
        tracker.releaseValue({
          type,
          data: object as unknown as IArray,
          untracked: true
        })
        expect(object.refCount).toStrictEqual(1)
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
