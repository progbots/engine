import { DictionaryValue, IDictionary, ValueType, checkDictionaryValue } from '@api'
import { DictionaryStackWhereResult, IDictionaryStack, Internal, InternalValue } from 'sdk'
import { DictStackUnderflow, Undefined } from '@errors'
import { MemoryTracker } from '@state/MemoryTracker'
import { ValueStack } from './ValueStack'
import { Dictionary, HostDictionary, SystemDictionary } from '@dictionaries'

export class DictionaryStack extends ValueStack implements IDictionaryStack {
  private readonly _host: HostDictionary
  private readonly _system: SystemDictionary = new SystemDictionary()
  private readonly _global: Dictionary
  private readonly _minCount: number

  constructor (tracker: MemoryTracker, hostDictionary?: IDictionary) {
    super(tracker)
    this._host = new HostDictionary(hostDictionary)
    this._global = new Dictionary(tracker)
    this.begin(this._host)
    this.begin(this._system)
    this.begin(this._global)
    this._minCount = this.length
  }

  get host (): HostDictionary {
    return this._host
  }

  get system (): SystemDictionary {
    return this._system
  }

  get global (): Dictionary {
    return this._global
  }

  get top (): Internal<DictionaryValue> {
    const value = this.safeAt(0)
    checkDictionaryValue(value)
    return value
  }

  begin (dictionary: IDictionary): void {
    this.push({
      type: ValueType.dictionary,
      dictionary
    })
  }

  end (): void {
    if (this.length === this._minCount) {
      throw new DictStackUnderflow()
    }
    this.pop()
  }

  where (name: string): DictionaryStackWhereResult {
    for (const dictionaryValue of this._values) {
      checkDictionaryValue(dictionaryValue)
      const { dictionary } = dictionaryValue
      const value = dictionary.lookup(name)
      if (value !== null) {
        return {
          dictionary,
          value
        }
      }
    }
    return null
  }

  lookup (name: string): InternalValue {
    const result = this.where(name)
    if (result === null) {
      throw new Undefined()
    }
    return result.value
  }
}
