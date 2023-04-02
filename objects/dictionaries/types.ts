import { IDictionary } from '../..'
import { InternalValue } from '../../state'

export interface IWritableDictionary extends IDictionary {
  def: (name: string, value: InternalValue) => void
}
