import { IDictionary, ValueType, checkDictionaryValue } from '../../index'
import { DictStackUnderflow, Undefined } from '../../errors/index'
import { InternalValue } from '../../state/index'
import { ValueStack } from './ValueStack'
import { MemoryTracker } from '../../state/MemoryTracker'
import { Dictionary, HostDictionary, SystemDictionary } from '../dictionaries/index'

export type DictionaryStackWhereResult = {
  dictionary: IDictionary
  value: InternalValue
} | null

export class DictionaryStack extends ValueStack {
  private readonly _global: Dictionary
  private readonly _system: SystemDictionary = new SystemDictionary()
  private readonly _minCount: number

  constructor (tracker: MemoryTracker, hostDictionary?: IDictionary) {
    super(tracker)
    if (hostDictionary !== undefined) {
      this.begin(new HostDictionary(hostDictionary))
    }
    this.begin(this._system)
    this._global = new Dictionary(tracker)
    this.begin(this._global)
    this._minCount = this._values.length
  }

  get systemdict (): SystemDictionary {
    return this._system
  }

  get globaldict (): Dictionary {
    return this._global
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
