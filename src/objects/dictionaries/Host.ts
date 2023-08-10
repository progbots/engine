import { ShareableObject } from '../ShareableObject'
import { IDictionary, Value } from '../../index'

export class HostDictionary extends ShareableObject implements IDictionary {
  // region IDictionary

  get names (): string [] {
    return this._hostDictionary.names
  }

  lookup (name: string): Value | null {
    return this._hostDictionary.lookup(name)
  }

  // endregion IDictionary

  constructor (
    private readonly _hostDictionary: IDictionary
  ) {
    super()
  }

  protected _dispose (): void {}
}
