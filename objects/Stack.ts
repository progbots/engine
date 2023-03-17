import { ShareableObject } from './ShareableObject'
import { Value } from '../types'
import { MemoryTracker } from '../state/MemoryTracker'
import { StackUnderflow } from '../errors'

export class Stack extends ShareableObject {
  public static readonly VALUE_ADDITIONAL_SIZE = MemoryTracker.POINTER_SIZE

  private readonly _values: Value[] = []

  constructor (
    private readonly _memoryTracker: MemoryTracker
  ) {
    super()
  }

  push (value: Value): void {
    this._memoryTracker.addValueRef(value)
    this._memoryTracker.increment(Stack.VALUE_ADDITIONAL_SIZE)
    this._values.unshift(value)
  }

  pop (): void {
    if (this._values.length === 0) {
      throw new StackUnderflow()
    }
    const [value] = this._values
    this._memoryTracker.releaseValue(value)
    this._memoryTracker.decrement(Stack.VALUE_ADDITIONAL_SIZE)
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

  protected _dispose (): void {
    while (this._values.length > 0) {
      this.pop()
    }
  }
}
