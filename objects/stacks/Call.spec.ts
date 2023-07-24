import { CallStack, Stack } from './index'
import { MemoryTracker } from '../../state/MemoryTracker'
import { IArray, ValueType } from '../../index'
import { Internal, StackUnderflow } from '../../errors/index'
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

  describe('CallStep specific APIs', () => {
    describe('When stack is empty', () => {
      it('fails top', () => {
        expect(() => stack.top).toThrow(StackUnderflow)
      })

      it('fails step', () => {
        expect(() => stack.step).toThrow(StackUnderflow)
      })

      it('fails parameters', () => {
        expect(() => stack.parameters).toThrow(StackUnderflow)
      })
    })

    describe('top', () => {
      it('gives access to the value and the state', () => {
        stack.push({
          type: ValueType.string,
          data: 'test'
        })
        expect(stack.top).toStrictEqual({
          type: ValueType.string,
          data: 'test'
        })
      })

      it('ignores any integer added to the call stack', () => {
        stack.push({
          type: ValueType.string,
          data: 'test'
        })
        stack.push({
          type: ValueType.integer,
          data: 0
        })
        expect(stack.top).toStrictEqual({
          type: ValueType.string,
          data: 'test'
        })
      })

      it('fails if only an integer is in the call stack', () => {
        stack.push({
          type: ValueType.integer,
          data: 0
        })
        expect(() => stack.top).toThrow(StackUnderflow)
      })
    })

    describe('step', () => {
      beforeEach(() => {
        stack.push({
          type: ValueType.string,
          data: 'test'
        })
      })

      it('initializes with 0', () => {
        expect(stack.step).toStrictEqual(0)
      })

      it('can be changed to another value', () => {
        stack.step = 42
        expect(stack.step).toStrictEqual(42)
      })
    })

    describe('index', () => {
      beforeEach(() => {
        stack.push({
          type: ValueType.string,
          data: 'test'
        })
      })

      it('initializes with -1', () => {
        expect(stack.index).toStrictEqual(-1)
      })

      it('can be changed to another value', () => {
        stack.index = 42
        expect(stack.index).toStrictEqual(42)
      })

      it('sets the index on top of the stack', () => {
        stack.index = 42
        expect(stack.ref).toStrictEqual([{
          type: ValueType.integer,
          data: 42
        }, {
          type: ValueType.string,
          data: 'test'
        }])
      })

      it('pops the index with the value', () => {
        stack.index = 42
        stack.pop()
        expect(stack.ref).toStrictEqual([])
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

        it('can be set only once', () => {
          expect(() => { stack.parameters = [] }).toThrowError(Internal)
        })

        it('frees the values', () => {
          stack.pop()
          expect(tracker.used).toStrictEqual(initialMemoryUsed)
          expect(object.disposeCalled).toStrictEqual(1)
        })
      })

      describe('push & pop', () => {
        it('fails push when parameters are not set', () => {
          expect(() => stack.pushParameter({
            type: ValueType.integer,
            data: 42
          })).toThrowError(Internal)
        })

        it('fails pop when parameters are not set', () => {
          expect(() => stack.popParameter()).toThrowError(Internal)
        })

        it('pushes a parameter to an existing list', () => {
          stack.parameters = []
          stack.pushParameter({
            type: ValueType.integer,
            data: 42
          })
          expect(stack.parameters).toStrictEqual([{
            type: ValueType.integer,
            data: 42
          }])
        })

        it('pops a parameter from an existing list', () => {
          stack.parameters = []
          stack.pushParameter({
            type: ValueType.integer,
            data: 42
          })
          stack.popParameter()
          expect(stack.parameters).toStrictEqual([])
        })

        it('handles memory', () => {
          stack.parameters = []
          stack.pushParameter({
            type: ValueType.string,
            data: ''.padStart(1000, '1234567980')
          })
          expect(tracker.used).toBeGreaterThan(1000)
          stack.pop()
          expect(tracker.used).toStrictEqual(initialMemoryUsed)
        })
      })
    })
  })
})
