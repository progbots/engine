import { IDictionary, Value, ValueType, checkStringValue } from '@api'
import { InternalValue, IWritableDictionary } from '@sdk'
import { ShareableObject } from '@objects/ShareableObject'
import { BaseError, TypeCheck } from '@errors'

const NAME_PROPERTY = 'name'
const MESSAGE_PROPERTY = 'message'

const extract = (dictionary: IDictionary, name: string): string => {
  const value = dictionary.lookup(name)
  if (value === null || value.type !== ValueType.string) {
    throw new TypeCheck()
  }
  checkStringValue(value)
  return value.string
}

export class Custom extends BaseError {
  constructor (
    private readonly _dictionary: IWritableDictionary
  ) {
    super(extract(_dictionary, MESSAGE_PROPERTY))
    this.name = this.name + `:${extract(_dictionary, NAME_PROPERTY)}`
  }

  override get dictionary (): IDictionary {
    return this._dictionary
  }

  override release (): void {
    ShareableObject.release({
      type: ValueType.dictionary,
      dictionary: this._dictionary
    })
  }

  // region IWritableDictionary

  override get names (): string[] {
    return this._dictionary.names
  }

  override lookup (name: string): Value | null {
    return this._dictionary.lookup(name)
  }

  def (name: string, value: InternalValue): void {
    this._dictionary.def(name, value)
  }

  // endregion IWritableDictionary
}
