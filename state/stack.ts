import { Value } from '../types'
import { MemoryTracker } from './memory'
import { StackUnderflow } from '../errors'

const STACK_SLOT_BYTES = 4

export class Stack {
  private readonly _values: Value[] = []

  constructor (
    private readonly _memoryTracker: MemoryTracker
  ) {}

  push (value: Value): number {
    this._memoryTracker.addRef(value)
    this._memoryTracker.increment(STACK_SLOT_BYTES)
    this._values.unshift(value)
    return this._values.length
  }

  pop (): number {
    if (this._values.length === 0) {
      throw new StackUnderflow()
    }
    const [value] = this._values
    this._memoryTracker.release(value)
    this._memoryTracker.decrement(STACK_SLOT_BYTES)
    this._values.shift()
    return this._values.length
  }

  * [Symbol.iterator] (): Generator<Value> {
    for (const value of this._values) {
      yield value
    }
  }
}
