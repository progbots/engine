import { IArray, IDictionary, ValueType } from '../Value'
import { Internal } from '../errors/index'
import { InternalValue } from '../state/index'

const TOOMANY_RELEASE = 'Superfluous release'

export abstract class ShareableObject {
  public static extract (value: InternalValue): ShareableObject | undefined {
    let object: IArray | IDictionary | undefined
    if (value.type === ValueType.block) {
      object = value.block
    } else if (value.type === ValueType.array) {
      object = value.array
    } else if (value.type === ValueType.dictionary) {
      object = value.dictionary
    }
    if (object !== undefined && object instanceof ShareableObject) {
      return object
    }
  }

  public static addRef (values: InternalValue | InternalValue[]): void {
    if (Array.isArray(values)) {
      values.forEach(value => ShareableObject.extract(value)?.addRef())
    } else {
      ShareableObject.extract(values)?.addRef()
    }
  }

  public static release (values: InternalValue | InternalValue[]): void {
    if (Array.isArray(values)) {
      values.forEach(value => ShareableObject.extract(value)?.release())
    } else {
      ShareableObject.extract(values)?.release()
    }
  }

  private _refCount: number

  constructor () {
    this._refCount = 1
  }

  get refCount (): number {
    return this._refCount
  }

  addRef (): void {
    ++this._refCount
  }

  release (): void {
    const refCount = --this._refCount
    if (refCount === 0) {
      this._dispose()
    } else
    // Stryker disable next-line EqualityOperator
    if (refCount < 0) {
      throw new Internal(TOOMANY_RELEASE)
    }
  }

  protected abstract _dispose (): void
}
