import { Value, ValueType } from '@api'
import { InternalValue } from '@sdk'
import { InternalError } from '@errors'
import { Dictionary } from '@objects/dictionaries/index'
import { MemoryTracker } from '@state/MemoryTracker'
import { BaseValueArray } from './BaseValueArray'

class MyArray extends BaseValueArray {
  protected pushImpl (value: InternalValue): void {
    this._values.push(value)
  }

  protected popImpl (): InternalValue {
    const values = this.getNonEmptyValueArray()
    const value = values[values.length - 1]
    values.pop()
    return value
  }

  public getMemoryTracker (): MemoryTracker {
    return this.memoryTracker
  }

  public clear (): void {
    this._clear()
  }
}

describe('objects/BaseValueArray', () => {
  let tracker: MemoryTracker
  let array: MyArray
  let dictionary: Dictionary

  beforeEach(() => {
    tracker = new MemoryTracker()
    array = new MyArray(tracker)
    dictionary = new Dictionary(tracker)
    array.push({
      type: ValueType.integer,
      number: 1
    })
    array.push({
      type: ValueType.string,
      string: 'abc'
    })
    array.push({
      type: ValueType.dictionary,
      dictionary
    })
    dictionary.release()
    expect(dictionary.refCount).toStrictEqual(1)
  })

  it('tracks memory used', () => {
    expect(tracker.used).not.toStrictEqual(0)
  })

  it('exposes the memory tracker', () => {
    expect(array.getMemoryTracker()).toStrictEqual(tracker)
  })

  it('offers an array reference', () => {
    const expected: Value[] = [{
      type: ValueType.integer,
      number: 1
    }, {
      type: ValueType.string,
      string: 'abc'
    }, {
      type: ValueType.dictionary,
      dictionary: expect.anything()
    }]
    expect(array.ref).toStrictEqual(expected)
  })

  describe('IArray', () => {
    it('exposes length', () => {
      expect(array.length).toStrictEqual(3)
    })

    it('exposes at', () => {
      const expected: Value = {
        type: ValueType.integer,
        number: 1
      }
      expect(array.at(0)).toStrictEqual(expected)
    })

    it('controls boundaries (-1)', () => {
      expect(array.at(-1)).toStrictEqual(null)
    })

    it('controls boundaries (0-based)', () => {
      expect(array.at(array.length)).toStrictEqual(null)
    })
  })

  describe('removing items', () => {
    it('releases memory when removing items', () => {
      const before = tracker.used
      array.pop()
      expect(tracker.used).toBeLessThan(before)
      expect(dictionary.refCount).toStrictEqual(0)
    })

    it('fails after all items were removed', () => {
      array.clear()
      expect(() => array.pop()).toThrowError(InternalError)
    })
  })

  it('releases memory once disposed', () => {
    array.release()
    expect(dictionary.refCount).toStrictEqual(0)
    expect(tracker.used).toStrictEqual(0)
  })
})
