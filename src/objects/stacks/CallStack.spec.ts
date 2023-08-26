import { IArray, Value, ValueType } from '@api'
import { Internal, InternalError, StackUnderflow } from '@errors'
import { MemoryTracker } from '@state/MemoryTracker'
import { CallStack } from './CallStack'
import { ValueStack } from './ValueStack'
import { ShareableObject } from '../ShareableObject'

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

describe('objects/stacks/CallStack', () => {
  let tracker: MemoryTracker
  let stack: CallStack

  beforeEach(() => {
    tracker = new MemoryTracker()
    stack = new CallStack(tracker)
  })

  it('counts extra memory for the additional values', () => {
    const baseTracker = new MemoryTracker()
    const baseStack = new ValueStack(baseTracker)
    baseStack.push({
      type: ValueType.string,
      string: 'test'
    })
    stack.push({
      type: ValueType.string,
      string: 'test'
    })
    expect(tracker.used).toBeGreaterThan(baseTracker.used)
    expect(tracker.used).toStrictEqual(baseTracker.used + CallStack.EXTRA_SIZE)
  })

  it('forbids pushing an integer to the call stack', () => {
    expect(() => stack.push({ type: ValueType.integer, number: 0 })).toThrowError(InternalError)
  })

  describe('CallStep specific APIs', () => {
    describe('When stack is empty', () => {
      it('fails top', () => {
        expect(() => stack.top).toThrow(StackUnderflow)
      })

      it('fails step', () => {
        expect(() => stack.step).toThrow(StackUnderflow)
      })

      it('returns a default value for index', () => {
        expect(stack.index).toStrictEqual(CallStack.NO_INDEX)
      })

      it('fails parameters', () => {
        expect(() => stack.parameters).toThrow(StackUnderflow)
      })
    })

    describe('top', () => {
      it('gives access to the value and the state', () => {
        const expected: Value = {
          type: ValueType.string,
          string: 'test'
        }
        stack.push(expected)
        expect(stack.top).toStrictEqual(expected)
      })

      it('ignores index (added internally to the call stack)', () => {
        const expected: Value = {
          type: ValueType.string,
          string: 'test'
        }
        stack.push(expected)
        stack.index = 0
        expect(stack.top).toStrictEqual(expected)
      })
    })

    describe('step', () => {
      beforeEach(() => {
        stack.push({
          type: ValueType.string,
          string: 'test'
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
          string: 'test'
        })
      })

      it('initializes with NO_INDEX', () => {
        expect(stack.index).toStrictEqual(CallStack.NO_INDEX)
      })

      it('can be changed to another value', () => {
        stack.index = 42
        expect(stack.index).toStrictEqual(42)
      })

      it('sets the index on top of the stack', () => {
        stack.index = 42
        const expected: Value[] = [{
          type: ValueType.integer,
          number: 42
        }, {
          type: ValueType.string,
          string: 'test'
        }]
        expect(stack.ref).toStrictEqual(expected)
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
          string: 'test'
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
            array: object
          }]
          expect(object.refCount).toStrictEqual(2)
          object.release()
        })

        it('keeps the object referenced', () => {
          expect(object.disposeCalled).toStrictEqual(0)
        })

        it('increases memory', () => {
          const baseTracker = new MemoryTracker()
          const baseStack = new ValueStack(baseTracker)
          baseStack.push({
            type: ValueType.string,
            string: 'test'
          })
          expect(tracker.used).toBeGreaterThan(baseTracker.used + CallStack.EXTRA_SIZE)
        })

        it('returns the value', () => {
          const expected: Value[] = [{
            type: ValueType.array,
            array: object
          }]
          expect(stack.parameters).toStrictEqual(expected)
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
            number: 42
          })).toThrowError(Internal)
        })

        it('fails pop when parameters are not set', () => {
          expect(() => stack.popParameter()).toThrowError(Internal)
        })

        it('pushes a parameter to an existing list', () => {
          stack.parameters = []
          stack.pushParameter({
            type: ValueType.integer,
            number: 42
          })
          const expected: Value[] = [{
            type: ValueType.integer,
            number: 42
          }]
          expect(stack.parameters).toStrictEqual(expected)
        })

        it('pops a parameter from an existing list', () => {
          stack.parameters = []
          stack.pushParameter({
            type: ValueType.integer,
            number: 42
          })
          stack.popParameter()
          expect(stack.parameters).toStrictEqual([])
        })

        it('handles memory', () => {
          stack.parameters = []
          stack.pushParameter({
            type: ValueType.string,
            string: ''.padStart(1000, '1234567980')
          })
          expect(tracker.used).toBeGreaterThan(1000)
          stack.pop()
          expect(tracker.used).toStrictEqual(initialMemoryUsed)
        })
      })
    })

    describe('stacking', () => {
      it('gives access to parameters *after* setting the index', () => {
        stack.push({
          type: ValueType.string,
          string: 'test'
        })
        stack.parameters = [{
          type: ValueType.integer,
          number: 42
        }]
        stack.index = 13
        const expectedRef: Value[] = [{
          type: ValueType.integer,
          number: 13
        }, {
          type: ValueType.string,
          string: 'test'
        }]
        expect(stack.ref).toStrictEqual(expectedRef)
        const expectedParameters: Value[] = [{
          type: ValueType.integer,
          number: 42
        }]
        expect(stack.parameters).toStrictEqual(expectedParameters)
      })
    })
  })
})
