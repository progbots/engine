import { IDictionary } from '../../index'
import { InternalValue } from '../../state/index'
import { InvalidAccess } from '../../errors'

export interface IWritableDictionary extends IDictionary {
  def: (name: string, value: InternalValue) => void
}

export function checkIWritableDictionary (dict: IDictionary): asserts dict is IWritableDictionary {
  const method = (dict as object as Record<string, Function>).def
  if (typeof method !== 'function' || method.length !== 2) {
    throw new InvalidAccess()
  }
}
