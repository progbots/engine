import { IDictionary, Value } from '../..'

export interface IWritableDictionary extends IDictionary {
  def: (name: string, value: Value) => void
}
