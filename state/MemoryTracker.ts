import { Value, ValueType } from '../types'
import { ShareableObject } from '../objects/ShareableObject'

const stringSizer = (data: string): number => {
  const encoder = new TextEncoder()
  const buffer = encoder.encode(data)
  return buffer.length + 1 // terminal 0
}

function isCachableString (value: Value): boolean {
  if ([ValueType.string, ValueType.name, ValueType.call].includes(value.type)) {
    const text = value.data as string
    return text.length >= MemoryTracker.CACHABLE_STRING_LENGTH
  }
  return false
}

function isShareableObject (value: Value): boolean {
  return ![
    ValueType.integer,
    ValueType.name,
    ValueType.string,
    ValueType.operator,
    ValueType.mark
  ].includes(value.type)
}

export class MemoryTracker {
  public static readonly POINTER_SIZE = 4
  public static readonly INTEGER_SIZE = 4
  public static readonly VALUE_TYPE_SIZE = 1
  public static readonly VALUE_SIZE = MemoryTracker.VALUE_TYPE_SIZE + MemoryTracker.POINTER_SIZE
  public static readonly CACHABLE_STRING_LENGTH = 32

  private _used: number = 0

  private readonly _strings: string[] = []
  private readonly _stringsRefCount: number[] = []

  private _addStringRef (value: Value): number {
    const text = value.data as string
    const pos = this._strings.indexOf(text)
    if (pos === -1) {
      this._strings.push(text)
      this._stringsRefCount.push(1)
      return stringSizer(text) + MemoryTracker.INTEGER_SIZE
    }
    ++this._stringsRefCount[pos]
    return 0
  }

  private _releaseString (value: Value): number {
    const text = value.data as string
    const pos = this._strings.indexOf(text)
    const refCount = --this._stringsRefCount[pos]
    if (refCount === 0) {
      return stringSizer(text) + MemoryTracker.INTEGER_SIZE
    }
    return 0
  }

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
    let valueSize: number = MemoryTracker.VALUE_SIZE
    if (isCachableString(value)) {
      valueSize += this._addStringRef(value)
    } else if (isShareableObject(value)) {
      const shareableObject = value.data as unknown as ShareableObject
      shareableObject.addRef()
    }
    this.increment(valueSize)
  }

  releaseValue (value: Value): void {
    let valueSize: number = MemoryTracker.VALUE_SIZE
    if (isCachableString(value)) {
      valueSize += this._releaseString(value)
    } else if (isShareableObject(value)) {
      const shareableObject = value.data as unknown as ShareableObject
      shareableObject.release()
    }
    this.decrement(valueSize)
  }

  increment (bytes: number): void {
    this._used += bytes
  }

  decrement (bytes: number): void {
    this._used -= bytes
  }
}
