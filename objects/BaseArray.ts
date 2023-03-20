import { ShareableObject } from './ShareableObject'
import { IArray, Value } from '..'
import { MemoryTracker } from '../state/MemoryTracker'
import { StackUnderflow } from '../errors'

export abstract class BaseArray extends ShareableObject implements IArray {
  public static readonly VALUE_ADDITIONAL_SIZE = MemoryTracker.POINTER_SIZE

  protected readonly _values: Value[] = []

  constructor (
    private readonly _memoryTracker: MemoryTracker
  ) {
    super()
  }

  // region IArray

  get length (): number {
    return this._values.length
  }

  at (index: number): Value {
    const value = this._values[index]
    if (value === undefined) {
      throw new RangeError()
    }
    // copy to avoid alterations
    const { type, data } = value
    return {
      type,
      data
    }
  }

  // endregion IArray

  protected addValueRef (value: Value): void {
    this._memoryTracker.addValueRef(value)
    this._memoryTracker.increment(BaseArray.VALUE_ADDITIONAL_SIZE)
  }

  protected abstract pushImpl (value: Value): void

  push (value: Value): void {
    this.addValueRef(value)
    this.pushImpl(value)
  }

  protected releaseValue (value: Value): void {
    this._memoryTracker.releaseValue(value)
    this._memoryTracker.decrement(BaseArray.VALUE_ADDITIONAL_SIZE)
  }

  protected abstract popImpl (): Value

  pop (): void {
    if (this._values.length === 0) {
      throw new StackUnderflow()
    }
    const value = this.popImpl()
    this.releaseValue(value)
  }

  get ref (): readonly Value[] {
    return this._values
  }

  protected _dispose (): void {
    while (this._values.length > 0) {
      this.pop()
    }
  }
}
