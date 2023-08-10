import { Internal } from '../src/errors/index'
import { InternalValue } from '../state/index'

const TOOMANY_RELEASE = 'Superfluous release'

export abstract class ShareableObject {
  public static addRef (values: InternalValue | InternalValue[]): void {
    if (Array.isArray(values)) {
      values.forEach(value => {
        if (value.data instanceof ShareableObject) {
          value.data.addRef()
        }
      })
    } else if (values.data instanceof ShareableObject) {
      values.data.addRef()
    }
  }

  public static release (values: InternalValue | InternalValue[]): void {
    if (Array.isArray(values)) {
      values.forEach(value => {
        if (value.data instanceof ShareableObject) {
          value.data.release()
        }
      })
    } else if (values.data instanceof ShareableObject) {
      values.data.release()
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
