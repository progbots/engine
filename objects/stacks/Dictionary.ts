import { IDictionary, ValueType } from '../../index'
import { DictStackUnderflow, Undefined } from '../../errors/index'
import { InternalValue } from '../../state/index'
import { Stack } from './Stack'

export class DictionaryStack extends Stack {
  lookup (name: string): InternalValue {
    for (const dictionaryValue of this._values) {
      const dictionary = dictionaryValue.data as IDictionary
      const value = dictionary.lookup(name)
      if (value !== null) {
        return value
      }
    }
    throw new Undefined()
  }

  begin (dictionary: IDictionary): void {
    this._values.push({
      type: ValueType.dict,
      data: dictionary
    })
  }

  end (): void {
    if (this._values.length === this._minDictCount) {
      throw new DictStackUnderflow()
    }
    this._values.pop()
  }
}
