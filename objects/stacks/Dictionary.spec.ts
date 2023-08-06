import { DictStackUnderflow, Undefined } from '../../errors/index'
import { IDictionary, Value, ValueType } from '../../index'
import { MemoryTracker } from '../../state/MemoryTracker'
import { Dictionary } from '../dictionaries/index'
import { DictionaryStack } from './Dictionary'

describe('objects/stacks/Dictionary', () => {
  let tracker: MemoryTracker
  let stack: DictionaryStack

  const host: IDictionary = {
    get names () { return ['test'] },
    lookup (name: string): Value | null {
      if (name === 'hostname') {
        return {
          type: ValueType.string,
          data: 'localhost'
        }
      }
      return null
    }
  }

  beforeEach(() => {
    tracker = new MemoryTracker()
    stack = new DictionaryStack(tracker)
  })

  describe('initial setup', () => {
    it('contains two dictionaries', () => {
      expect(stack.ref.length).toStrictEqual(2)
    })

    it('exposes a non empty systemdict', () => {
      const { systemdict } = stack
      expect(systemdict.names.length).toBeGreaterThan(0)
    })

    it('exposes an empty globaldict', () => {
      const { globaldict } = stack
      expect(globaldict.names.length).toStrictEqual(0)
    })

    describe('with a host dictionary', () => {
      it('contains three dictionaries', () => {
        const stackWithHost = new DictionaryStack(tracker, host)
        expect(stackWithHost.ref.length).toStrictEqual(3)
      })
    })
  })

  describe('where', () => {
    it('searches for a known name (from systemdict)', () => {
      expect(stack.where('add')).toStrictEqual({
        dict: stack.systemdict,
        value: {
          type: ValueType.operator,
          data: expect.anything()
        }
      })
    })

    it('searches for a known name (from globaldict)', () => {
      stack.globaldict.def('add', {
        type: ValueType.string,
        data: 'my_add'
      })
      expect(stack.where('add')).toStrictEqual({
        dict: stack.globaldict,
        value: {
          type: ValueType.string,
          data: 'my_add'
        }
      })
    })

    it('returns null if the name is not found in the stack', () => {
      expect(stack.where('unknown')).toStrictEqual(null)
    })

    describe('with a host dictionary', () => {
      it('resolves host name', () => {
        const stackWithHost = new DictionaryStack(tracker, host)
        expect(stackWithHost.where('hostname')).toStrictEqual({
          dict: host,
          value: {
            type: ValueType.string,
            data: 'localhost'
          }
        })
      })
    })
  })

  describe('lookup', () => {
    it('searches for a known name (from systemdict)', () => {
      expect(stack.lookup('add')).toStrictEqual({
        type: ValueType.operator,
        data: expect.anything()
      })
    })

    it('searches for a known name (from globaldict)', () => {
      stack.globaldict.def('add', {
        type: ValueType.string,
        data: 'my_add'
      })
      expect(stack.lookup('add')).toStrictEqual({
        type: ValueType.string,
        data: 'my_add'
      })
    })

    it('fails with Undefined if the name is not found in the stack', () => {
      expect(() => stack.lookup('unknown')).toThrowError(Undefined)
    })

    describe('with a host dictionary', () => {
      it('resolves host name', () => {
        const stackWithHost = new DictionaryStack(tracker, host)
        expect(stackWithHost.lookup('hostname')).toStrictEqual({
          type: ValueType.string,
          data: 'localhost'
        })
      })
    })
  })

  describe('begin', () => {
    let dict: Dictionary

    beforeEach(() => {
      dict = new Dictionary(tracker)
      dict.def('add', {
        type: ValueType.string,
        data: 'another_add'
      })
      stack.begin(dict)
    })

    it('adds a new dictionary to the stack', () => {
      expect(stack.lookup('add')).toStrictEqual({
        type: ValueType.string,
        data: 'another_add'
      })
    })

    describe('end', () => {
      beforeEach(() => {
        stack.end()
      })

      it('removes the top dictionary from the stack', () => {
        expect(stack.lookup('add')).toStrictEqual({
          type: ValueType.operator,
          data: expect.anything()
        })
      })

      it('fails when attempting to remove pre-installed dictionaries', () => {
        expect(() => stack.end()).toThrowError(DictStackUnderflow)
      })
    })
  })
})
