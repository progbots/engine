import { IDictionary, Value, ValueType } from '../types'
import { SystemDictionary } from '../dictionaries'

const stringSizer = (data: string): number => {
  const encoder = new TextEncoder()
  const buffer = encoder.encode(data)
  return buffer.length + 1 // terminal 0
}

const sizers: Record<ValueType, (value: Value) => number> = {
  [ValueType.integer]: () => 4,
  [ValueType.string]: (value) => stringSizer(value.data as string),
  [ValueType.name]: (value) => stringSizer(value.data as string),
  [ValueType.operator]: () => 0, // considered ROM
  [ValueType.array]: (value) => (value.data as Value[]).reduce((sum: number, subValue: Value) => sum + size(subValue), 0),
  [ValueType.dict]: (value) => {
    const dictionary = value.data as IDictionary
    if (dictionary instanceof SystemDictionary) {
      return 0 // considered ROM
    }
    const keys = dictionary.keys()
    return keys.reduce((sum: number, key: string) => sum + stringSizer(key) + size(dictionary.lookup(key) as Value), 0)
  }
}

function size (value: Value): number {
  return 1 /* type */ + sizers[value.type](value)
}

export class MemoryTracker {
  private _used: number = 0

  constructor (
    private readonly _total: number = Infinity
  ) {}

  get used (): number {
    return this._used
  }

  get total (): number {
    return this._total
  }

  addValueRef (value: Value): void {
    this._used += size(value)
  }

  releaseValue (value: Value): void {
    this._used -= size(value)
  }

  increment (bytes: number): void {
    this._used += bytes
  }

  decrement (bytes: number): void {
    this._used -= bytes
  }
}
