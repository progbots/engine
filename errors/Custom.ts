import { IDictionary, Value, ValueType } from '../index'
import { ShareableObject } from '../objects/ShareableObject'
import { IWritableDictionary } from '../objects/dictionaries/index'
import { InternalValue } from '../state/index'
import { InternalError } from './InternalError'
import { TypeCheck } from './TypeCheck'

const NAME_PROPERTY = 'name'
const MESSAGE_PROPERTY = 'message'

const extract = (dict: IDictionary, name: string): string => {
  const value = dict.lookup(name)
  if (value === null || value.type !== ValueType.string) {
    throw new TypeCheck()
  }
  return value.data
}

export class Custom extends InternalError {
  constructor (
    private readonly _dictionary: IWritableDictionary
  ) {
    super(extract(_dictionary, MESSAGE_PROPERTY))
    this.name = this.name + `:${extract(_dictionary, NAME_PROPERTY)}`
  }

  get dictionary (): IDictionary {
    return this._dictionary
  }

  release (): void {
    ShareableObject.release({
      type: ValueType.dict,
      data: this._dictionary
    })
  }

  // region IWritableDictionary

  get names (): string[] {
    return this._dictionary.names
  }

  lookup (name: string): Value | null {
    return this._dictionary.lookup(name)
  }

  def (name: string, value: InternalValue): void {
    this._dictionary.def(name, value)
  }

  // endregion IWritableDictionary
}
