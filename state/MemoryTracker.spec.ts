import { ValueType } from '..'
import { VMError } from '../errors'
import { MemoryTracker } from './MemoryTracker'

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
  })

  describe('VMerror', () => {
    it('raises an error if limit is exceeded', () => {
      const tracker = new MemoryTracker(10)
      expect(() => tracker.increment(11)).toThrowError(VMError)
    })
  })
})
