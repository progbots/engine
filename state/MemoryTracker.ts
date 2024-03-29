import { IStateMemory, Value, ValueType } from '../index'
import { InternalValue } from './index'
import { VMError } from '../errors/index'
import { ShareableObject } from '../objects/ShareableObject'

const stringSizer = (data: string): number => {
  const encoder = new TextEncoder()
  const buffer = encoder.encode(data)
  return buffer.length + 1 // terminal 0
}

function isString (value: Value): boolean {
  return [
    ValueType.string,
    ValueType.call
  ].includes(value.type)
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

  private _addStringRef (value: Value): number {
    const text = value.data as string
    const size = stringSizer(text)
    if (text.length >= MemoryTracker.CACHABLE_STRING_LENGTH) {
      const pos = this._strings.indexOf(text)
      if (pos === -1) {
        this._strings.push(text)
        this._stringsRefCount.push(1)
        return size + MemoryTracker.INTEGER_SIZE
      }
      ++this._stringsRefCount[pos]
      return 0
    }
    return size
  }

  private _releaseString (value: Value): number {
    const text = value.data as string
    const size = stringSizer(text)
    if (text.length >= MemoryTracker.CACHABLE_STRING_LENGTH) {
      const pos = this._strings.indexOf(text)
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
      if (isString(value)) {
        valueSize += this._addStringRef(value)
      } else {
        ShareableObject.addRef(value)
      }
    }
    this.increment(valueSize)
  }

  releaseValue (value: InternalValue): void {
    let valueSize: number = MemoryTracker.VALUE_SIZE
    if (value.untracked !== true) {
      if (isString(value)) {
        valueSize += this._releaseString(value)
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
