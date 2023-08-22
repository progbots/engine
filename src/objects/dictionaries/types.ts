import { IDictionary } from '../../index'
import { InternalValue, checkIDictionary } from '../../state/index'
import { InvalidAccess } from '../../errors/index'

export interface IWritableDictionary extends IDictionary {
  def: (name: string, value: InternalValue) => void
}

export function checkIWritableDictionary (dict: any): asserts dict is IWritableDictionary {
  const { def } = dict
  if (typeof def !== 'function' || def.length !== 2) {
    throw new InvalidAccess()
  }
  checkIDictionary(dict)
}
