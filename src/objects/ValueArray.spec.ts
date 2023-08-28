import { Value, ValueType, checkIntegerValue } from '@api'
import { Internal, RangeCheck } from '@errors'
import { MemoryTracker } from '@state/MemoryTracker'
import { ValueArray } from './ValueArray'

describe('objects/ValueArray', () => {
  let tracker: MemoryTracker
  let array: ValueArray

  beforeEach(() => {
    tracker = new MemoryTracker()
    array = new ValueArray(tracker)
    array.push({
      type: ValueType.integer,
      number: 1
    })
    array.push({
      type: ValueType.integer,
      number: 2
    })
  })

  it('tracks memory used', () => {
    expect(tracker.used).not.toStrictEqual(0)
  })

  it('offers an array reference', () => {
    expect(array.ref).toStrictEqual<Value[]>([{
      type: ValueType.integer,
      number: 1
    }, {
      type: ValueType.integer,
      number: 2
    }])
  })

  it('implements a LIFO array (pop)', () => {
    array.pop()
    expect(array.ref).toStrictEqual<Value[]>([{
      type: ValueType.integer,
      number: 1
    }])
  })

  it('implements shift', () => {
    const value = array.shift()
    expect(array.ref).toStrictEqual<Value[]>([{
      type: ValueType.integer,
      number: 2
    }])
    expect(value).toStrictEqual<Value>({
      type: ValueType.integer,
      number: 1
    })
  })

  it('fails shift on empty array', () => {
    const emptyArray = new ValueArray(tracker)
    expect(() => emptyArray.shift()).toThrowError(Internal)
  })

  it('implements unshift', () => {
    array.unshift({
      type: ValueType.integer,
      number: 3
    })
    expect(array.ref).toStrictEqual<Value[]>([{
      type: ValueType.integer,
      number: 3
    }, {
      type: ValueType.integer,
      number: 1
    }, {
      type: ValueType.integer,
      number: 2
    }])
  })

  describe('set', () => {
    it('allows setting a new item', () => {
      array.set(2, {
        type: ValueType.integer,
        number: 3
      })
      expect(array.ref).toStrictEqual<Value[]>([{
        type: ValueType.integer,
        number: 1
      }, {
        type: ValueType.integer,
        number: 2
      }, {
        type: ValueType.integer,
        number: 3
      }])
    })

    it('allows overriding an item', () => {
      const initialMemory = tracker.used
      array.set(0, {
        type: ValueType.integer,
        number: -1
      })
      expect(array.ref).toStrictEqual<Value[]>([{
        type: ValueType.integer,
        number: -1
      }, {
        type: ValueType.integer,
        number: 2
      }])
      expect(tracker.used).toStrictEqual(initialMemory)
    })

    it('fails with RangeCheck on invalid index', () => {
      expect(() => array.set(-1, {
        type: ValueType.integer,
        number: 0
      })).toThrowError(RangeCheck)
    })
  })

  it('offers some', () => {
    expect(array.some(value => {
      checkIntegerValue(value)
      return value.number === 2
    })).toStrictEqual(true)
    expect(array.some(value => {
      checkIntegerValue(value)
      return value.number === 3
    })).toStrictEqual(false)
  })
})
