import { Internal } from '../errors/index'
import { IArray, IDictionary, ValueType } from '../index'
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
    expect(object.refCount).toStrictEqual(1)
    expect(object.disposeCalled).toStrictEqual(0)
    object.addRef()
    expect(object.refCount).toStrictEqual(2)
    expect(object.disposeCalled).toStrictEqual(0)
    object.release()
    expect(object.refCount).toStrictEqual(1)
    expect(object.disposeCalled).toStrictEqual(0)
    object.release()
    expect(object.refCount).toStrictEqual(0)
    expect(object.disposeCalled).toStrictEqual(1)
  })

  it('detects invalid use of release', () => {
    const object = new MyObject()
    expect(object.refCount).toStrictEqual(1)
    object.release()
    expect(() => object.release()).toThrow(Internal)
  })

  it('offers a generic addRef helper', () => {
    const object = new MyObject()
    ShareableObject.addRef({
      type: ValueType.array,
      data: object as unknown as IArray
    })
    expect(object.refCount).toStrictEqual(2)
  })

  it('offers a generic release helper', () => {
    const object = new MyObject()
    ShareableObject.release({
      type: ValueType.array,
      data: object as unknown as IArray
    })
    expect(object.refCount).toStrictEqual(0)
  })

  it('offers a mass and generic addRef helper', () => {
    const obj1 = new MyObject()
    const obj2 = new MyObject()
    ShareableObject.addRef([{
      type: ValueType.array,
      data: obj1 as unknown as IArray
    }, {
      type: ValueType.dict,
      data: obj2 as unknown as IDictionary
    }])
    expect(obj1.refCount).toStrictEqual(2)
    expect(obj2.refCount).toStrictEqual(2)
  })

  it('offers a mass and generic release helper', () => {
    const obj1 = new MyObject()
    const obj2 = new MyObject()
    ShareableObject.release([{
      type: ValueType.array,
      data: obj1 as unknown as IArray
    }, {
      type: ValueType.dict,
      data: obj2 as unknown as IDictionary
    }])
    expect(obj1.refCount).toStrictEqual(0)
    expect(obj2.refCount).toStrictEqual(0)
  })
})
