import { BaseArray } from './BaseArray'
import { MemoryTracker } from '../state/MemoryTracker'
import { ValueType } from '../index'
import { InternalValue, checkGenericValue } from '../state/index'
import { Dictionary } from './dictionaries/index'
import { RangeCheck } from '../src/errors/index'
import { InternalError } from '../src/errors/InternalError'

/* eslint-disable no-labels */

class MyArray extends BaseArray {
  protected pushImpl (value: InternalValue): void {
    this._values.push(value)
  }

  protected popImpl (): InternalValue {
    const value = this._values.at(-1)
    assert: checkGenericValue(value)
    this._values.pop()
    return value
  }

  public getMemoryTracker (): MemoryTracker {
    return this.memoryTracker
  }

  public clear (): void {
    this._clear()
  }
}

describe('objects/BaseArray', () => {
  let tracker: MemoryTracker
  let array: MyArray
  let dict: Dictionary

  beforeEach(() => {
    tracker = new MemoryTracker()
    array = new MyArray(tracker)
    dict = new Dictionary(tracker)
    array.push({
      type: ValueType.integer,
      data: 1
    })
    array.push({
      type: ValueType.string,
      data: 'abc'
    })
    array.push({
      type: ValueType.dict,
      data: dict
    })
    dict.release()
    expect(dict.refCount).toStrictEqual(1)
  })

  it('tracks memory used', () => {
    expect(tracker.used).not.toStrictEqual(0)
  })

  it('exposes the memory tracker', () => {
    expect(array.getMemoryTracker()).toStrictEqual(tracker)
  })

  it('offers an array reference', () => {
    expect(array.ref).toStrictEqual([{
      type: ValueType.integer,
      data: 1
    }, {
      type: ValueType.string,
      data: 'abc'
    }, {
      type: ValueType.dict,
      data: expect.anything()
    }])
  })

  describe('IArray', () => {
    it('exposes length', () => {
      expect(array.length).toStrictEqual(3)
    })

    it('exposes at', () => {
      expect(array.at(0)).toStrictEqual({
        type: ValueType.integer,
        data: 1
      })
    })

    it('controls boundaries (-1)', () => {
      expect(() => array.at(-1)).toThrowError(RangeCheck)
    })

    it('controls boundaries (0-based)', () => {
      expect(() => array.at(array.length)).toThrowError(RangeCheck)
    })
  })

  describe('removing items', () => {
    it('releases memory when removing items', () => {
      const before = tracker.used
      array.pop()
      expect(tracker.used).toBeLessThan(before)
      expect(dict.refCount).toStrictEqual(0)
    })

    it('fails after all items were removed', () => {
      array.clear()
      expect(() => array.pop()).toThrowError(InternalError)
    })
  })

  it('releases memory once disposed', () => {
    array.release()
    expect(dict.refCount).toStrictEqual(0)
    expect(tracker.used).toStrictEqual(0)
  })
})
