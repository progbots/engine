import { CallStack, CallStep, Stack } from './index'
import { MemoryTracker } from '../../state/MemoryTracker'
import { IArray, ValueType } from '../../index'
import { RangeCheck } from '../../errors/index'
import { ShareableObject } from '../ShareableObject'

class MyObject extends ShareableObject {
  public disposeCalled: number = 0

  protected _dispose (): void {
    ++this.disposeCalled
  }
}

describe('objects/stacks/Call', () => {
  let tracker: MemoryTracker
  let stack: CallStack

  beforeEach(() => {
    tracker = new MemoryTracker()
    stack = new CallStack(tracker)
  })

  it('counts extra memory for the additional values', () => {
    const baseTracker = new MemoryTracker()
    const baseStack = new Stack(baseTracker)
    baseStack.push({
      type: ValueType.string,
      data: 'test'
    })
    stack.push({
      type: ValueType.string,
      data: 'test'
    })
    expect(tracker.used).toBeGreaterThan(baseTracker.used)
    expect(tracker.used).toStrictEqual(baseTracker.used + CallStack.EXTRA_SIZE)
  })

  describe('CallStep', () => {
    describe('When stack is empty', () => {
      it('fails step', () => {
        expect(() => stack.step).toThrow(RangeCheck)
      })

      it('fails loopIndex', () => {
        expect(() => stack.loopIndex).toThrow(RangeCheck)
      })

      it('fails parameters', () => {
        expect(() => stack.parameters).toThrow(RangeCheck)
      })
    })

    describe('step', () => {
      beforeEach(() => {
        stack.push({
          type: ValueType.string,
          data: 'test'
        })
      })

      it('initializes with INIT', () => {
        expect(stack.step).toStrictEqual(CallStep.INIT)
      })

      it('can be changed to another value', () => {
        stack.step = CallStep.LOOP
        expect(stack.step).toStrictEqual(CallStep.LOOP)
      })
    })

    describe('loopIndex', () => {
      beforeEach(() => {
        stack.push({
          type: ValueType.string,
          data: 'test'
        })
      })

      it('initializes with -1', () => {
        expect(stack.loopIndex).toStrictEqual(-1)
      })

      it('can be changed to another value', () => {
        stack.loopIndex = 10
        expect(stack.loopIndex).toStrictEqual(10)
      })
    })

    describe('parameters', () => {
      let initialMemoryUsed: number

      beforeEach(() => {
        initialMemoryUsed = tracker.used
        stack.push({
          type: ValueType.string,
          data: 'test'
        })
      })

      it('initializes with []', () => {
        expect(stack.parameters).toStrictEqual([])
      })

      describe('changing the value', () => {
        let object: MyObject

        beforeEach(() => {
          object = new MyObject()
          stack.parameters = [{
            type: ValueType.array,
            data: object as unknown as IArray
          }]
          expect(object.refCount).toStrictEqual(2)
          object.release()
        })

        it('keeps the object referenced', () => {
          expect(object.disposeCalled).toStrictEqual(0)
        })

        it('increases memory', () => {
          const baseTracker = new MemoryTracker()
          const baseStack = new Stack(baseTracker)
          baseStack.push({
            type: ValueType.string,
            data: 'test'
          })
          expect(tracker.used).toBeGreaterThan(baseTracker.used + CallStack.EXTRA_SIZE)
        })

        it('returns the value', () => {
          expect(stack.parameters).toStrictEqual([{
            type: ValueType.array,
            data: object as unknown as IArray
          }])
        })

        it('frees the values', () => {
          stack.pop()
          expect(tracker.used).toStrictEqual(initialMemoryUsed)
          expect(object.disposeCalled).toStrictEqual(1)
        })
      })
    })
  })
})
