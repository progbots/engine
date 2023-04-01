import { InternalValue } from '../state'

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
    if (--this._refCount === 0) {
      this._dispose()
    }
  }

  protected abstract _dispose (): void
}
