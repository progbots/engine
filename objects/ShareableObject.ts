import { Value } from '..'

export abstract class ShareableObject {
  public static addRef (...values: Value[]): void {
    values.forEach(value => {
      if (value.data instanceof ShareableObject) {
        value.data.addRef()
      }
    })
  }

  public static release (...values: Value[]): void {
    values.forEach(value => {
      if (value.data instanceof ShareableObject) {
        value.data.release()
      }
    })
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
