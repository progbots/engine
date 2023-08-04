import { Stack } from './Stack'
import { MemoryTracker } from '../../state/MemoryTracker'
import { IArray, Value, ValueType } from '../../index'
import { StackUnderflow } from '../../errors/index'
import { ShareableObject } from '../ShareableObject'

class MyStack extends Stack {
  clear (): void {
    this._clear()
  }
}

class MyObject extends ShareableObject implements IArray {
  public disposeCalled: number = 0

  protected _dispose (): void {
    ++this.disposeCalled
  }

  // region IArray

  get length (): number { return 0 }
  at (index: number): Value { return { type: ValueType.integer, data: index } }

  // endregion
}

describe('objects/stacks/Stack', () => {
  let tracker: MemoryTracker
  let stack: MyStack
  let initialUsedMemory: number

  beforeEach(() => {
    tracker = new MemoryTracker()
    stack = new MyStack(tracker)
    initialUsedMemory = tracker.used
    stack.push({
      type: ValueType.string,
      data: 'abc'
    })
    stack.push({
      type: ValueType.integer,
      data: 123
    })
  })

  it('tracks memory used', () => {
    expect(tracker.used).not.toStrictEqual(0)
  })

  it('offers an array reference', () => {
    expect(stack.ref).toStrictEqual([{
      type: ValueType.integer,
      data: 123
    }, {
      type: ValueType.string,
      data: 'abc'
    }])
  })

  it('implements a LIFO stack (pop)', () => {
    stack.pop()
    expect(stack.ref).toStrictEqual([{
      type: ValueType.string,
      data: 'abc'
    }])
  })

  it('fails pop with StackUnderflow after all items were removed', () => {
    stack.clear()
    expect(() => stack.pop()).toThrowError(StackUnderflow)
  })

  describe('splice', () => {
    it('removes values from the stack', () => {
      stack.splice(2)
      expect(tracker.used).toStrictEqual(initialUsedMemory)
    })

    describe('handling of shared objects', () => {
      let sharedObject: MyObject

      beforeEach(() => {
        sharedObject = new MyObject()
        stack.push({
          type: ValueType.array,
          data: sharedObject
        })
        sharedObject.release()
        expect(sharedObject.refCount).toStrictEqual(1)
      })

      it('releases on splice', () => {
        stack.splice(1)
        expect(sharedObject.refCount).toStrictEqual(0)
        expect(sharedObject.disposeCalled).toStrictEqual(1)
      })

      it('does not release if added again (1)', () => {
        stack.splice(1, [{
          type: ValueType.array,
          data: sharedObject
        }])
        expect(sharedObject.refCount).toStrictEqual(1)
        expect(sharedObject.disposeCalled).toStrictEqual(0)
      })
    })

    it('removes and adds values to the stack (1)', () => {
      stack.splice(1, {
        type: ValueType.integer,
        data: 456
      })
      expect(stack.ref).toStrictEqual([{
        type: ValueType.integer,
        data: 456
      }, {
        type: ValueType.string,
        data: 'abc'
      }])
    })

    it('removes and adds values to the stack (2)', () => {
      stack.splice(2, [{
        type: ValueType.integer,
        data: 456
      }, {
        type: ValueType.string,
        data: 'def'
      }])
      expect(stack.ref).toStrictEqual([{
        type: ValueType.string,
        data: 'def'
      }, {
        type: ValueType.integer,
        data: 456
      }])
    })

    it('fails with StackUnderflow if not enough values', () => {
      expect(() => stack.splice(3)).toThrowError(StackUnderflow)
    })
  })
})
