import { Stack } from './Stack'
import { MemoryTracker } from '../state/MemoryTracker'
import { ValueType } from '../index'

// test-for BaseArray.ts

describe('objects/Stack', () => {
  let tracker: MemoryTracker
  let stack: Stack

  beforeEach(() => {
    tracker = new MemoryTracker()
    stack = new Stack(tracker)
    stack.push({
      type: ValueType.integer,
      data: 1
    })
    stack.push({
      type: ValueType.integer,
      data: 2
    })
  })

  it('tracks memory used', () => {
    expect(tracker.used).not.toStrictEqual(0)
  })

  it('offers an array reference', () => {
    expect(stack.ref).toStrictEqual([{
      type: ValueType.integer,
      data: 2
    }, {
      type: ValueType.integer,
      data: 1
    }])
  })

  it('implements a LIFO stack (pop)', () => {
    stack.pop()
    expect(stack.ref).toStrictEqual([{
      type: ValueType.integer,
      data: 1
    }])
  })

  it('exposes array items', () => {
    const values = stack.ref
    expect(values).toStrictEqual([{
      type: ValueType.integer,
      data: 2
    }, {
      type: ValueType.integer,
      data: 1
    }])
  })

  it('releases memory once disposed', () => {
    stack.release()
    expect(tracker.used).toStrictEqual(0)
  })
})
