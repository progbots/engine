import { IStateMemory, Value, ValueType } from '@api'
import { InternalValue } from '@sdk'
import { VMError } from '@errors'
import { ShareableObject } from '@objects/ShareableObject'

const stringSizer = (data: string): number => {
  const encoder = new TextEncoder()
  const buffer = encoder.encode(data)
  return buffer.length + 1 // terminal 0
}

function extractString (value: Value): string | undefined {
  if (value.type === ValueType.string) {
    return value.string
  } else if (value.type === ValueType.call) {
    return value.call
  }
  return undefined
}

export class MemoryTracker implements IStateMemory {
  public static readonly POINTER_SIZE = 4
  public static readonly INTEGER_SIZE = 4
  public static readonly VALUE_TYPE_SIZE = 1
  public static readonly VALUE_SIZE = MemoryTracker.VALUE_TYPE_SIZE + MemoryTracker.POINTER_SIZE
  public static readonly CACHABLE_STRING_LENGTH = 32

  private _used: number = 0
  private _peak: number = 0

  private readonly _strings: string[] = []
  private readonly _stringsRefCount: number[] = []

  private _addStringRef (string: string): number {
    const size = stringSizer(string)
    if (string.length >= MemoryTracker.CACHABLE_STRING_LENGTH) {
      const pos = this._strings.indexOf(string)
      if (pos === -1) {
        this._strings.push(string)
        this._stringsRefCount.push(1)
        return size + MemoryTracker.INTEGER_SIZE
      }
      ++this._stringsRefCount[pos]
      return 0
    }
    return size
  }

  private _releaseString (string: string): number {
    const size = stringSizer(string)
    if (string.length >= MemoryTracker.CACHABLE_STRING_LENGTH) {
      const pos = this._strings.indexOf(string)
      const refCount = --this._stringsRefCount[pos]
      if (refCount === 0) {
        return size + MemoryTracker.INTEGER_SIZE
      }
      return 0
    }
    return size
  }

  constructor (
    private readonly _total: number = Infinity
  ) {}

  get used (): number {
    return this._used
  }

  get peak (): number {
    return this._peak
  }

  get total (): number {
    return this._total
  }

  addValueRef (value: InternalValue): void {
    let valueSize: number = MemoryTracker.VALUE_SIZE
    if (value.untracked !== true) {
      const string = extractString(value)
      if (string !== undefined) {
        valueSize += this._addStringRef(string)
      } else {
        ShareableObject.addRef(value)
      }
    }
    this.increment(valueSize)
  }

  releaseValue (value: InternalValue): void {
    let valueSize: number = MemoryTracker.VALUE_SIZE
    if (value.untracked !== true) {
      const string = extractString(value)
      if (string !== undefined) {
        valueSize += this._releaseString(string)
      } else {
        ShareableObject.release(value)
      }
    }
    this.decrement(valueSize)
  }

  increment (bytes: number): void {
    this._used += bytes
    if (this._used > this._total) {
      throw new VMError()
    }
    this._peak = Math.max(this._used, this._peak)
  }

  decrement (bytes: number): void {
    this._used -= bytes
  }
}
