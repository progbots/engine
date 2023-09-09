import { IArray, IDictionary, Value, ValueType } from '@api'
import { InternalError } from '@errors'
import { ShareableObject } from './ShareableObject'

class MyObject extends ShareableObject implements IArray, IDictionary {
  public disposeCalled: number = 0

  protected _dispose (): void {
    ++this.disposeCalled
  }

  // region IArray

  get length (): number { return 0 }
  at (number: number): Value { return { type: ValueType.integer, number } }

  // endregion

  // region IDictionary

  get names (): string[] { return [] }
  lookup (string: string): Value { return { type: ValueType.string, string } }

  // endregion
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
    expect(() => object.release()).toThrow(InternalError)
  })

  it('offers a generic addRef helper', () => {
    const object = new MyObject()
    ShareableObject.addRef({
      type: ValueType.array,
      array: object
    })
    expect(object.refCount).toStrictEqual(2)
  })

  it('offers a generic release helper', () => {
    const object = new MyObject()
    ShareableObject.release({
      type: ValueType.array,
      array: object
    })
    expect(object.refCount).toStrictEqual(0)
  })

  it('offers a mass and generic addRef helper', () => {
    const obj1 = new MyObject()
    const obj2 = new MyObject()
    ShareableObject.addRef([{
      type: ValueType.array,
      array: obj1
    }, {
      type: ValueType.dictionary,
      dictionary: obj2
    }])
    expect(obj1.refCount).toStrictEqual(2)
    expect(obj2.refCount).toStrictEqual(2)
  })

  it('offers a mass and generic release helper', () => {
    const obj1 = new MyObject()
    const obj2 = new MyObject()
    ShareableObject.release([{
      type: ValueType.array,
      array: obj1
    }, {
      type: ValueType.dictionary,
      dictionary: obj2
    }])
    expect(obj1.refCount).toStrictEqual(0)
    expect(obj2.refCount).toStrictEqual(0)
  })
})
