import { DictionaryValue, IDictionary } from '@api'
import { Internal, InternalValue } from './InternalValue'
import { IStack } from './IStack'

export type DictionaryStackWhereResult = {
  dictionary: IDictionary
  value: InternalValue
} | null

export interface IDictionaryStack extends IStack {
  readonly host: IDictionary
  readonly system: IDictionary
  readonly global: IDictionary
  readonly top: Internal<DictionaryValue>
  begin: (dictionary: IDictionary) => void
  end: () => void
  where: (name: string) => DictionaryStackWhereResult
  lookup: (name: string) => InternalValue
}
