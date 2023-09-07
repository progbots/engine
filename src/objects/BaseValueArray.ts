import { IArray, Value } from '@api'
import { IMemoryTracker, InternalValue, MEMORY_POINTER_SIZE } from '@sdk'
import { InternalError } from '@errors'
import { ShareableObject } from './ShareableObject'

const UNSAFE_VALUE = 'Unexpected unsafe value'

export abstract class BaseValueArray extends ShareableObject implements IArray {
  public static readonly INITIAL_SIZE = MEMORY_POINTER_SIZE
  public static readonly VALUE_ADDITIONAL_SIZE = MEMORY_POINTER_SIZE

  protected readonly _values: InternalValue[] = []

  constructor (
    private readonly _memoryTracker: IMemoryTracker
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

  protected get memoryTracker (): IMemoryTracker {
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
      throw new InternalError(UNSAFE_VALUE)
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
