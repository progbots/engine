import { ValueType } from '@api'
import { StackUnderflow, TypeCheck, UnmatchedMark } from '@errors'
import { MemoryTracker } from '@state/MemoryTracker'
import { OperandStack } from './OperandStack'
import { InternalValue } from '@sdk'

describe('objects/stacks/OperandStack', () => {
  let tracker: MemoryTracker
  let stack: OperandStack

  beforeEach(() => {
    tracker = new MemoryTracker()
    stack = new OperandStack(tracker)
    stack.push({
      type: ValueType.string,
      string: 'abc'
    })
    stack.push({
      type: ValueType.integer,
      number: 123
    })
  })

  describe('check', () => {
    it('retrieves values of any type (1)', () => {
      expect(stack.check(null)).toStrictEqual<InternalValue[]>([{
        type: ValueType.integer,
        number: 123
      }])
    })

    it('retrieves values of any type (2)', () => {
      expect(stack.check(null, null)).toStrictEqual<InternalValue[]>([{
        type: ValueType.integer,
        number: 123
      }, {
        type: ValueType.string,
        string: 'abc'
      }])
    })

    it('retrieves values of a given type (1)', () => {
      expect(stack.check(ValueType.integer)).toStrictEqual<InternalValue[]>([{
        type: ValueType.integer,
        number: 123
      }])
    })

    it('retrieves values of a given type (2)', () => {
      expect(stack.check(ValueType.integer, ValueType.string)).toStrictEqual<InternalValue[]>([{
        type: ValueType.integer,
        number: 123
      }, {
        type: ValueType.string,
        string: 'abc'
      }])
    })

    it('fails with StackUnderflow if not enough values (any)', () => {
      expect(() => stack.check(null, null, null)).toThrowError(StackUnderflow)
    })

    it('fails with StackUnderflow if not enough values (typed)', () => {
      expect(() => stack.check(ValueType.integer, ValueType.string, ValueType.integer)).toThrowError(StackUnderflow)
    })

    it('fails with TypeCheck on unmatched type (1)', () => {
      expect(() => stack.check(ValueType.string)).toThrowError(TypeCheck)
    })

    it('fails with TypeCheck on unmatched type (2)', () => {
      expect(() => stack.check(ValueType.integer, ValueType.integer)).toThrowError(TypeCheck)
    })
  })

  describe('findMarkPos', () => {
    it('gives position of the mark (1)', () => {
      stack.push({
        type: ValueType.mark
      })
      expect(stack.findMarkPos()).toStrictEqual(0)
    })

    it('gives position of the mark (2)', () => {
      stack.push({
        type: ValueType.mark
      })
      stack.push({
        type: ValueType.integer,
        number: 456
      })
      expect(stack.findMarkPos()).toStrictEqual(1)
    })

    it('fails with UnmatchedMark if no mark found', () => {
      expect(() => stack.findMarkPos()).toThrowError(UnmatchedMark)
    })
  })
})
