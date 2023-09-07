import { Value, ValueType } from '@api'
import { IMemoryTracker, InternalValue, IWritableDictionary, MEMORY_POINTER_SIZE, scanGenericValue } from '@sdk'
import { ShareableObject } from '@objects/ShareableObject'
import { DICT_TYPE_INTERNAL_NAME, DICT_TYPE } from './dict-type'

export class Dictionary extends ShareableObject implements IWritableDictionary {
  public static readonly INITIAL_SIZE = MEMORY_POINTER_SIZE
  public static readonly VALUE_ADDITIONAL_SIZE = 3 * MEMORY_POINTER_SIZE

  private readonly _values: Record<string, InternalValue> = {}

  constructor (
    private readonly _memoryTracker: IMemoryTracker
  ) {
    super()
    this._memoryTracker.increment(Dictionary.INITIAL_SIZE)
  }

  // region IDictionary

  get names (): string [] {
    return Object.keys(this._values)
  }

  lookup (name: string): Value | null {
    const value = this._values[name]
    if (value === undefined) {
      if (name === DICT_TYPE_INTERNAL_NAME) {
        return {
          type: ValueType.string,
          string: DICT_TYPE
        }
      }
      return null
    }
    return value
  }

  // endregion IDictionary

  // region IWritableDictionary

  def (name: string, value: InternalValue): void {
    // TODO: how do we delete a value (can we ?)
    const old = this._values[name]
    if (old !== undefined) {
      this._memoryTracker.releaseValue(old)
    } else {
      this._memoryTracker.addValueRef({
        type: ValueType.string,
        string: name
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
      scanGenericValue(value)
      this._memoryTracker.releaseValue(value)
      this._memoryTracker.releaseValue({
        type: ValueType.string,
        string: name
      })
      this._memoryTracker.decrement(Dictionary.VALUE_ADDITIONAL_SIZE)
    })
    this._memoryTracker.decrement(Dictionary.INITIAL_SIZE)
  }
}
