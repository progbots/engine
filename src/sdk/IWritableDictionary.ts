import { IDictionary } from '@api'
import { InternalValue } from './InternalValue'

export interface IWritableDictionary extends IDictionary {
  def: (name: string, value: InternalValue) => void
}
