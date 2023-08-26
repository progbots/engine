import { IArray, IDictionary } from '@api'
import { InternalValue } from './InternalValue'

export type DictionaryStackWhereResult = {
  dictionary: IDictionary
  value: InternalValue
} | null

export interface IDictionaryStack extends IArray {
  readonly host: IDictionary
  readonly system: IDictionary
  readonly global: IDictionary
  begin: (dictionary: IDictionary) => void
  end: () => void
  where: (name: string) => DictionaryStackWhereResult
  lookup: (name: string) => InternalValue
}
