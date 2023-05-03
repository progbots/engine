import { Stack } from './Stack'
import { MemoryTracker } from '../state/MemoryTracker'
import { ValueType } from '../index'
import { StackUnderflow } from '../errors'

class MyStack extends Stack {
  clear (): void {
    this._clear()
  }
}

describe('objects/Stack', () => {
  let tracker: MemoryTracker
  let stack: MyStack

  beforeEach(() => {
    tracker = new MemoryTracker()
    stack = new MyStack(tracker)
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

  it('fails pop with StackUnderflow after all items were removed', () => {
    stack.clear()
    expect(() => stack.pop()).toThrowError(StackUnderflow)
  })
})
