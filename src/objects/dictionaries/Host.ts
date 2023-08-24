import { IDictionary, Value } from '@api'
import { ShareableObject } from '../ShareableObject'

export class HostDictionary extends ShareableObject implements IDictionary {
  // region IDictionary

  get names (): string [] {
    return this._hostDictionary.names
  }

  lookup (name: string): Value | null {
    const value = this._hostDictionary.lookup(name)
    if (value !== null) {
      // TODO validate that the value is correct
    }
    return value
  }

  // endregion IDictionary

  constructor (
    private readonly _hostDictionary: IDictionary
  ) {
    super()
  }

  protected _dispose (): void {}
}
