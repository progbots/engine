import { IDictionary, ValueType } from '../../index'
import { DictStackUnderflow, Undefined } from '../../errors/index'
import { InternalValue, checkIDictionary } from '../../state/index'
import { Stack } from './Stack'
import { MemoryTracker } from '../../state/MemoryTracker'
import { Dictionary, HostDictionary, SystemDictionary } from '../dictionaries/index'

export class DictionaryStack extends Stack {
  private readonly _globaldict: Dictionary
  private readonly _systemdict: SystemDictionary = new SystemDictionary()
  private readonly _minDictCount: number

  constructor (tracker: MemoryTracker, hostDictionary?: IDictionary) {
    super(tracker)
    if (hostDictionary !== undefined) {
      this.begin(new HostDictionary(hostDictionary))
    }
    this.begin(this._systemdict)
    this._globaldict = new Dictionary(tracker)
    this.begin(this._globaldict)
    this._minDictCount = this._values.length
  }

  get systemdict (): SystemDictionary {
    return this._systemdict
  }

  get globaldict (): Dictionary {
    return this._globaldict
  }

  begin (dictionary: IDictionary): void {
    this.push({
      type: ValueType.dict,
      data: dictionary
    })
  }

  end (): void {
    if (this.length === this._minDictCount) {
      throw new DictStackUnderflow()
    }
    this.pop()
  }

  where (name: string): {
    dict: IDictionary
    value: InternalValue
  } | null {
    for (const dictionaryValue of this._values) {
      checkIDictionary(dictionaryValue.data)
      const value = dictionaryValue.data.lookup(name)
      if (value !== null) {
        return {
          dict: dictionaryValue.data,
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
