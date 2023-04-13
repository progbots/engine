import { ShareableObject } from './ShareableObject'
import { IArray, Value } from '../index'
import { MemoryTracker } from '../state/MemoryTracker'
import { RangeCheck, StackUnderflow } from '../errors/index'
import { InternalValue } from '../state/index'

export abstract class BaseArray extends ShareableObject implements IArray {
  public static readonly INITIAL_SIZE = MemoryTracker.POINTER_SIZE
  public static readonly VALUE_ADDITIONAL_SIZE = MemoryTracker.POINTER_SIZE

  protected readonly _values: InternalValue[] = []

  constructor (
    private readonly _memoryTracker: MemoryTracker
  ) {
    super()
    this._memoryTracker.increment(BaseArray.INITIAL_SIZE)
  }

  // region IArray

  get length (): number {
    return this._values.length
  }

  at (index: number): Value {
    const value = this._values[index]
    if (value === undefined) {
      throw new RangeCheck()
    }
    // copy to avoid alterations
    return Object.assign({}, value)
  }

  // endregion IArray

  protected addValueRef (value: InternalValue): void {
    this._memoryTracker.addValueRef(value)
    this._memoryTracker.increment(BaseArray.VALUE_ADDITIONAL_SIZE)
  }

  protected abstract pushImpl (value: InternalValue): void

  push (value: InternalValue): void {
    this.addValueRef(value)
    this.pushImpl(value)
  }

  protected releaseValue (value: InternalValue): void {
    this._memoryTracker.releaseValue(value)
    this._memoryTracker.decrement(BaseArray.VALUE_ADDITIONAL_SIZE)
  }

  protected abstract popImpl (): InternalValue

  pop (): void {
    if (this._values.length === 0) {
      throw new StackUnderflow()
    }
    const value = this.popImpl()
    this.releaseValue(value)
  }

  get ref (): readonly InternalValue[] {
    return this._values
  }

  protected _dispose (): void {
    while (this._values.length > 0) {
      this.pop()
    }
    this._memoryTracker.decrement(BaseArray.INITIAL_SIZE)
  }
}
