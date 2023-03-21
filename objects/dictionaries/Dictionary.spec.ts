import { Dictionary } from './Dictionary'
import { MemoryTracker } from '../../state/MemoryTracker'
import { ValueType } from '../..'

describe('objects/dictionaries/Dictionary', () => {
  let tracker: MemoryTracker
  let dictionary: Dictionary
  let initiallyUsed: number

  beforeEach(() => {
    tracker = new MemoryTracker()
    dictionary = new Dictionary(tracker)
    dictionary.def('name1', {
      type: ValueType.integer,
      data: 1
    })
    dictionary.def('name2', {
      type: ValueType.integer,
      data: 2
    })
    initiallyUsed = tracker.used
  })

  it('tracks memory used', () => {
    expect(initiallyUsed).not.toStrictEqual(0)
  })

  it('offers list of names', () => {
    expect(dictionary.names).toStrictEqual(['name1', 'name2'])
  })

  it('retrieves a value by its name', () => {
    const value = dictionary.lookup('name1')
    expect(value).toStrictEqual({
      type: ValueType.integer,
      data: 1
    })
  })

  it('returns null on an unknown name', () => {
    const value = dictionary.lookup('name0')
    expect(value).toStrictEqual(null)
  })

  it('allows the override of a named value', () => {
    dictionary.def('name2', {
      type: ValueType.integer,
      data: 3
    })
    expect(dictionary.lookup('name2')).toStrictEqual({
      type: ValueType.integer,
      data: 3
    })
    // Same name does (and simple value) not increase memory
    expect(tracker.used).toStrictEqual(initiallyUsed)
  })

  it('allows new values', () => {
    dictionary.def('name3', {
      type: ValueType.integer,
      data: 3
    })
    expect(dictionary.lookup('name3')).toStrictEqual({
      type: ValueType.integer,
      data: 3
    })
    expect(tracker.used).toBeGreaterThan(initiallyUsed)
  })

  it('releases memory once disposed', () => {
    dictionary.release()
    expect(tracker.used).toStrictEqual(0)
  })
})
