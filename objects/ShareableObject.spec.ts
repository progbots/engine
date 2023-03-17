import { ShareableObject } from './ShareableObject'

class MyObject extends ShareableObject {
  public disposeCalled: number = 0

  protected _dispose (): void {
    ++this.disposeCalled
  }
}

describe('objects/ShareableObject', () => {
  it('calls _dispose on last reference count', () => {
    const object = new MyObject()
    expect(object.disposeCalled).toStrictEqual(0)
    object.addRef()
    expect(object.disposeCalled).toStrictEqual(0)
    object.release()
    expect(object.disposeCalled).toStrictEqual(0)
    object.release()
    expect(object.disposeCalled).toStrictEqual(1)
  })
})
