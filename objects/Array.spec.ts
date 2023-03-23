import { ArrayLike } from './Array'
import { MemoryTracker } from '../state/MemoryTracker'
import { ValueType } from '..'

describe('objects/Array', () => {
  let tracker: MemoryTracker
  let array: ArrayLike

  beforeEach(() => {
    tracker = new MemoryTracker()
    array = new ArrayLike(tracker)
    array.push({
      type: ValueType.integer,
      data: 1
    })
    array.push({
      type: ValueType.integer,
      data: 2
    })
  })

  it('tracks memory used', () => {
    expect(tracker.used).not.toStrictEqual(0)
  })

  it('offers an array reference', () => {
    expect(array.ref).toStrictEqual([{
      type: ValueType.integer,
      data: 1
    }, {
      type: ValueType.integer,
      data: 2
    }])
  })

  it('implements a LIFO array (pop)', () => {
    array.pop()
    expect(array.ref).toStrictEqual([{
      type: ValueType.integer,
      data: 1
    }])
  })

  it('implements shift', () => {
    const value = array.shift()
    expect(array.ref).toStrictEqual([{
      type: ValueType.integer,
      data: 2
    }])
    expect(value).toStrictEqual({
      type: ValueType.integer,
      data: 1
    })
  })

  it('implements unshift', () => {
    array.unshift({
      type: ValueType.integer,
      data: 3
    })
    expect(array.ref).toStrictEqual([{
      type: ValueType.integer,
      data: 3
    }, {
      type: ValueType.integer,
      data: 1
    }, {
      type: ValueType.integer,
      data: 2
    }])
  })

  it('exposes array items', () => {
    const values = array.ref
    expect(values).toStrictEqual([{
      type: ValueType.integer,
      data: 1
    }, {
      type: ValueType.integer,
      data: 2
    }])
  })

  it('allows setting item', () => {
    array.set(2, {
      type: ValueType.integer,
      data: 3
    })
    expect(array.ref).toStrictEqual([{
      type: ValueType.integer,
      data: 1
    }, {
      type: ValueType.integer,
      data: 2
    }, {
      type: ValueType.integer,
      data: 3
    }])
  })

  it('allows overriding an item', () => {
    const initialMemory = tracker.used
    array.set(0, {
      type: ValueType.integer,
      data: -1
    })
    expect(array.ref).toStrictEqual([{
      type: ValueType.integer,
      data: -1
    }, {
      type: ValueType.integer,
      data: 2
    }])
    expect(tracker.used).toStrictEqual(initialMemory)
  })

  it('releases memory once disposed', () => {
    array.release()
    expect(tracker.used).toStrictEqual(0)
  })
})
