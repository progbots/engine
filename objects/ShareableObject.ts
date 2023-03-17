export abstract class ShareableObject {
  private _refCount: number

  constructor () {
    this._refCount = 1
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
