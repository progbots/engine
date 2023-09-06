import { IDictionary, Value, ValueType } from '@api'
import { ShareableObject } from '../ShareableObject'
import { DICT_TYPE_INTERNAL_NAME, HOST_TYPE } from './dict-type'

export class HostDictionary extends ShareableObject implements IDictionary {
  // region IDictionary

  get names (): string [] {
    return this._hostDictionary.names
  }

  lookup (name: string): Value | null {
    const value = this._hostDictionary.lookup(name)
    if (value === null) {
      if (name === DICT_TYPE_INTERNAL_NAME) {
        return {
          type: ValueType.string,
          string: HOST_TYPE
        }
      }
      return null
    }
    // TODO validate that the value is correct
    return value
  }

  // endregion IDictionary

  constructor (
    private readonly _hostDictionary: IDictionary = {
      names: [],
      lookup: () => null
    }
  ) {
    super()
  }

  protected _dispose (): void {}
}
