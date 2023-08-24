import { IArray, Value } from '@api'
import { InternalValue } from '@sdk'
import { InternalError } from '@errors'
import { MemoryTracker } from '@state/MemoryTracker'
import { ShareableObject } from './ShareableObject'

const EMPTY_ARRAY = 'Empty array'

export abstract class BaseValueArray extends ShareableObject implements IArray {
  public static readonly INITIAL_SIZE = MemoryTracker.POINTER_SIZE
  public static readonly VALUE_ADDITIONAL_SIZE = MemoryTracker.POINTER_SIZE

  protected readonly _values: InternalValue[] = []

  constructor (
    private readonly _memoryTracker: MemoryTracker
  ) {
    super()
    this._memoryTracker.increment(BaseValueArray.INITIAL_SIZE)
  }

  // region IArray

  get length (): number {
    return this._values.length
  }

  at (index: number): Value | null {
    const value = this._values[index]
    if (value === undefined) {
      return null
    }
    // copy to avoid alterations
    return Object.assign({}, value)
  }

  // endregion IArray

  protected get memoryTracker (): MemoryTracker {
    return this._memoryTracker
  }

  protected addValueRef (value: InternalValue): void {
    this._memoryTracker.addValueRef(value)
    this._memoryTracker.increment(BaseValueArray.VALUE_ADDITIONAL_SIZE)
  }

  protected abstract pushImpl (value: InternalValue): void

  push (value: InternalValue): void {
    this.addValueRef(value)
    this.pushImpl(value)
  }

  protected releaseValue (value: InternalValue): void {
    this._memoryTracker.releaseValue(value)
    this._memoryTracker.decrement(BaseValueArray.VALUE_ADDITIONAL_SIZE)
  }

  protected abstract popImpl (): InternalValue

  protected safeAt (index: number): InternalValue {
    const value = this._values.at(index)
    if (value === undefined) {
      throw new InternalError(EMPTY_ARRAY)
    }
    return value
  }

  pop (): void {
    const value = this.popImpl()
    this.releaseValue(value)
  }

  get ref (): readonly InternalValue[] {
    return this._values
  }

  protected _clear (): void {
    for (const value of this._values) {
      this._memoryTracker.releaseValue(value)
    }
    this._memoryTracker.decrement(this._values.length * BaseValueArray.VALUE_ADDITIONAL_SIZE)
    this._values.length = 0
  }

  protected _dispose (): void {
    this._clear()
    this._memoryTracker.decrement(BaseValueArray.INITIAL_SIZE)
  }
}
