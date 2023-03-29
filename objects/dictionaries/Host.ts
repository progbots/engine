import { ShareableObject } from '../ShareableObject'
import { IWritableDictionary } from './types'
import { IDictionary, Value } from '../..'
import { InvalidAccess } from '../../errors'

export class HostDictionary extends ShareableObject implements IWritableDictionary {
  // region IWritableDictionary

  get names (): string [] {
    return this._hostDictionary.names
  }

  lookup (name: string): Value | null {
    return this._hostDictionary.lookup(name)
  }

  def (name: string, value: Value): void {
    throw new InvalidAccess()
  }

  // endregion IWritableDictionary

  constructor (
    private readonly _hostDictionary: IDictionary
  ) {
    super()
  }

  protected _dispose (): void {}
}
