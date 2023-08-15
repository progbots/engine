import { Dictionary } from './Dictionary'
import { MemoryTracker } from '../../state/MemoryTracker'
import { IArray, Value, ValueType } from '../../index'
import { ShareableObject } from '../ShareableObject'

class MyObject extends ShareableObject implements IArray {
  public disposeCalled: number = 0

  protected _dispose (): void {
    ++this.disposeCalled
  }

  // region IArray

  get length (): number { return 0 }
  at (index: number): Value { return { type: ValueType.integer, number: index } }

  // endregion
}

describe('objects/dictionaries/Dictionary', () => {
  let tracker: MemoryTracker
  let dictionary: Dictionary
  let initiallyUsed: number
  let sharedObject: MyObject

  beforeEach(() => {
    tracker = new MemoryTracker()
    dictionary = new Dictionary(tracker)
    dictionary.def('value1', {
      type: ValueType.integer,
      number: 1
    })
    dictionary.def('value2', {
      type: ValueType.integer,
      number: 2
    })
    sharedObject = new MyObject()
    dictionary.def('sharedobject', {
      type: ValueType.array,
      array: sharedObject
    })
    expect(sharedObject.refCount).toStrictEqual(2)
    sharedObject.release()
    initiallyUsed = tracker.used
  })

  it('tracks memory used', () => {
    expect(initiallyUsed).not.toStrictEqual(0)
  })

  it('offers list of names', () => {
    expect(dictionary.names).toStrictEqual(['value1', 'value2', 'sharedobject'])
  })

  it('retrieves a value by its name', () => {
    const value = dictionary.lookup('value1')
    const expected: Value = {
      type: ValueType.integer,
      number: 1
    }
    expect(value).toStrictEqual(expected)
  })

  it('returns null on an unknown name', () => {
    const value = dictionary.lookup('name0')
    expect(value).toStrictEqual(null)
  })

  it('allows the override of a named value', () => {
    const expected: Value = {
      type: ValueType.integer,
      number: 3
    }
    dictionary.def('value2', expected)
    expect(dictionary.lookup('value2')).toStrictEqual(expected)
    // Same name does (and simple value) not increase memory
    expect(tracker.used).toStrictEqual(initiallyUsed)
  })

  it('allows the override of a named value (shareable)', () => {
    dictionary.def('sharedobject', {
      type: ValueType.integer,
      number: 0
    })
    expect(sharedObject.disposeCalled).toStrictEqual(1)
  })

  it('allows new values', () => {
    const expected: Value = {
      type: ValueType.integer,
      number: 3
    }
    dictionary.def('new_value', expected)
    expect(dictionary.lookup('new_value')).toStrictEqual(expected)
    expect(tracker.used).toBeGreaterThan(initiallyUsed)
  })

  it('releases memory once disposed', () => {
    dictionary.release()
    expect(tracker.used).toStrictEqual(0)
  })
})
