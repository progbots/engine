import { Value, ValueType } from '../..'
import { MemoryTracker } from '../../state/MemoryTracker'
import { ShareableObject } from '../ShareableObject'
import { IWritableDictionary } from './types'

export class Dictionary extends ShareableObject implements IWritableDictionary {
  public static readonly INITIAL_SIZE = MemoryTracker.POINTER_SIZE
  public static readonly VALUE_ADDITIONAL_SIZE = 3 * MemoryTracker.POINTER_SIZE

  private readonly _values: Record<string, Value> = {}

  constructor (
    private readonly _memoryTracker: MemoryTracker
  ) {
    super()
    this._memoryTracker.increment(Dictionary.INITIAL_SIZE)
  }

  // region IWritableDictionary

  get names (): string [] {
    return Object.keys(this._values)
  }

  lookup (name: string): Value | null {
    const value = this._values[name]
    if (value === undefined) {
      return null
    }
    return value
  }

  def (name: string, value: Value): void {
    // TODO: how do we delete a value (can we ?)
    const old = this._values[name]
    if (old !== undefined) {
      this._memoryTracker.releaseValue(value)
    } else {
      this._memoryTracker.addValueRef({
        type: ValueType.string,
        data: name
      })
      this._memoryTracker.increment(Dictionary.VALUE_ADDITIONAL_SIZE)
    }
    this._memoryTracker.addValueRef(value)
    this._values[name] = value
  }

  // endregion IWritableDictionary

  protected _dispose (): void {
    this.names.forEach(name => {
      const value = this._values[name]
      this._memoryTracker.releaseValue(value)
      this._memoryTracker.releaseValue({
        type: ValueType.string,
        data: name
      })
      this._memoryTracker.decrement(Dictionary.VALUE_ADDITIONAL_SIZE)
    })
    this._memoryTracker.decrement(Dictionary.INITIAL_SIZE)
  }
}