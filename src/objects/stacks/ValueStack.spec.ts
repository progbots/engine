import { IArray, Value, ValueType } from '@api'
import { StackUnderflow } from '@errors'
import { MemoryTracker } from '@state/MemoryTracker'
import { ShareableObject } from '@objects/ShareableObject'
import { ValueStack } from './ValueStack'
import { InternalValue } from '@sdk'

class MyStack extends ValueStack {
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
  at (index: number): Value { return { type: ValueType.integer, number: index } }

  // endregion
}

describe('objects/stacks/ValueStack', () => {
  let tracker: MemoryTracker
  let stack: MyStack
  let initialUsedMemory: number

  beforeEach(() => {
    tracker = new MemoryTracker()
    stack = new MyStack(tracker)
    initialUsedMemory = tracker.used
    stack.push({
      type: ValueType.string,
      string: 'abc'
    })
    stack.push({
      type: ValueType.integer,
      number: 123
    })
  })

  it('tracks memory used', () => {
    expect(tracker.used).not.toStrictEqual(0)
  })

  it('offers an array reference', () => {
    expect(stack.ref).toStrictEqual<InternalValue[]>([{
      type: ValueType.integer,
      number: 123
    }, {
      type: ValueType.string,
      string: 'abc'
    }])
  })

  it('implements a LIFO stack (pop)', () => {
    stack.pop()
    expect(stack.ref).toStrictEqual<InternalValue[]>([{
      type: ValueType.string,
      string: 'abc'
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
          array: sharedObject
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
          array: sharedObject
        }])
        expect(sharedObject.refCount).toStrictEqual(1)
        expect(sharedObject.disposeCalled).toStrictEqual(0)
      })
    })

    it('removes and adds values to the stack (1)', () => {
      stack.splice(1, {
        type: ValueType.integer,
        number: 456
      })
      expect(stack.ref).toStrictEqual<InternalValue[]>([{
        type: ValueType.integer,
        number: 456
      }, {
        type: ValueType.string,
        string: 'abc'
      }])
    })

    it('removes and adds values to the stack (2)', () => {
      stack.splice(2, [{
        type: ValueType.integer,
        number: 456
      }, {
        type: ValueType.string,
        string: 'def'
      }])
      expect(stack.ref).toStrictEqual<InternalValue[]>([{
        type: ValueType.string,
        string: 'def'
      }, {
        type: ValueType.integer,
        number: 456
      }])
    })

    it('fails with StackUnderflow if not enough values', () => {
      expect(() => stack.splice(3)).toThrowError(StackUnderflow)
    })
  })
})
