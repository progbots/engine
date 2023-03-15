import { Value } from '../types'
import { MemoryTracker } from './MemoryTracker'
import { StackUnderflow } from '../errors'

const STACK_SLOT_BYTES = 4

export class Stack {
  private readonly _values: Value[] = []

  constructor (
    private readonly _memoryTracker: MemoryTracker
  ) {}

  push (value: Value): void {
    this._memoryTracker.addValueRef(value)
    this._memoryTracker.increment(STACK_SLOT_BYTES)
    this._values.unshift(value)
  }

  pop (): void {
    if (this._values.length === 0) {
      throw new StackUnderflow()
    }
    const [value] = this._values
    this._memoryTracker.releaseValue(value)
    this._memoryTracker.decrement(STACK_SLOT_BYTES)
    this._values.shift()
  }

  get ref (): readonly Value[] {
    return this._values
  }

  * [Symbol.iterator] (): Generator<Value> {
    for (const value of this._values) {
      yield value
    }
  }
}
