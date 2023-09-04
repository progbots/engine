import { IDictionary, Value, ValueType } from '@api'
import { ShareableObject } from '../ShareableObject'
import { dictTypeName } from './dict-type'

export class HostDictionary extends ShareableObject implements IDictionary {
  // region IDictionary

  get names (): string [] {
    return this._hostDictionary.names
  }

  lookup (name: string): Value | null {
    if (name === dictTypeName) {
      return {
        type: ValueType.string,
        string: 'hostdict'
      }
    }
    const value = this._hostDictionary.lookup(name)
    if (value !== null) {
      // TODO validate that the value is correct
    }
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
