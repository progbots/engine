import { IDictionary } from './IDictionary'
import { ValueType } from './ValueType'

export interface DictionaryValue {
  readonly type: ValueType.dictionary
  readonly dictionary: IDictionary
}
