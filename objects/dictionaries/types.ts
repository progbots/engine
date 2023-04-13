import { IDictionary } from '../../index'
import { InternalValue } from '../../state/index'

export interface IWritableDictionary extends IDictionary {
  def: (name: string, value: InternalValue) => void
}
