import { IDictionary, Value, ValueType } from '@api'
import { DictionaryStackWhereResult, InternalValue } from '@sdk'
import { DictStackUnderflow, Undefined } from '@errors'
import { MemoryTracker } from '@state/MemoryTracker'
import { Dictionary } from '@dictionaries'
import { DictionaryStack } from './DictionaryStack'

jest.mock('../dictionaries/System', () => {
  const { clear } = jest.requireActual('../../operators/operandstack/clear.ts')

  class SystemDictionary implements IDictionary {
    get names (): string [] {
      return ['clear']
    }

    lookup (name: string): Value | null {
      if (name === 'clear') {
        return {
          type: ValueType.operator,
          operator: clear
        }
      }
      return null
    }
  }

  return {
    SystemDictionary
  }
})

describe('objects/stacks/DictionaryStack', () => {
  let tracker: MemoryTracker
  let stack: DictionaryStack

  const host: IDictionary = {
    get names () { return ['test'] },
    lookup (name: string): Value | null {
      if (name === 'hostname') {
        return {
          type: ValueType.string,
          string: 'localhost'
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
    it('contains three dictionaries', () => {
      expect(stack.ref.length).toStrictEqual(3)
    })

    it('exposes an empty hostdict', () => {
      const { host } = stack
      expect(host.names.length).toStrictEqual(0)
    })

    it('exposes a non empty systemdict', () => {
      const { system } = stack
      expect(system.names.length).toBeGreaterThan(0)
    })

    it('exposes an empty globaldict', () => {
      const { global } = stack
      expect(global.names.length).toStrictEqual(0)
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
      expect(stack.where('clear')).toStrictEqual<DictionaryStackWhereResult>({
        dictionary: stack.system,
        value: {
          type: ValueType.operator,
          operator: expect.anything()
        }
      })
    })

    it('searches for a known name (from globaldict)', () => {
      stack.global.def('clear', {
        type: ValueType.string,
        string: 'my_clear'
      })
      expect(stack.where('clear')).toStrictEqual<DictionaryStackWhereResult>({
        dictionary: stack.global,
        value: {
          type: ValueType.string,
          string: 'my_clear'
        }
      })
    })

    it('returns null if the name is not found in the stack', () => {
      expect(stack.where('unknown')).toStrictEqual(null)
    })

    describe('host dictionary', () => {
      it('resolves host values', () => {
        const stackWithHost = new DictionaryStack(tracker, host)
        const result = stackWithHost.where('hostname')
        expect(result).toStrictEqual<DictionaryStackWhereResult>({
          dictionary: stackWithHost.host,
          value: {
            type: ValueType.string,
            string: 'localhost'
          }
        })
      })
    })
  })

  describe('lookup', () => {
    it('searches for a known name (from systemdict)', () => {
      expect(stack.lookup('clear')).toStrictEqual<InternalValue>({
        type: ValueType.operator,
        operator: expect.anything()
      })
    })

    it('searches for a known name (from globaldict)', () => {
      stack.global.def('clear', {
        type: ValueType.string,
        string: 'my_clear'
      })
      expect(stack.lookup('clear')).toStrictEqual<InternalValue>({
        type: ValueType.string,
        string: 'my_clear'
      })
    })

    it('fails with Undefined if the name is not found in the stack', () => {
      expect(() => stack.lookup('unknown')).toThrowError(Undefined)
    })

    describe('with a host dictionary', () => {
      it('resolves host name', () => {
        const stackWithHost = new DictionaryStack(tracker, host)
        expect(stackWithHost.lookup('hostname')).toStrictEqual<InternalValue>({
          type: ValueType.string,
          string: 'localhost'
        })
      })
    })
  })

  describe('begin', () => {
    let dict: Dictionary

    beforeEach(() => {
      dict = new Dictionary(tracker)
      dict.def('clear', {
        type: ValueType.string,
        string: 'another_clear'
      })
      stack.begin(dict)
    })

    it('adds a new dictionary to the stack', () => {
      expect(stack.lookup('clear')).toStrictEqual<InternalValue>({
        type: ValueType.string,
        string: 'another_clear'
      })
    })

    describe('end', () => {
      beforeEach(() => {
        stack.end()
      })

      it('removes the top dictionary from the stack', () => {
        expect(stack.lookup('clear')).toStrictEqual<InternalValue>({
          type: ValueType.operator,
          operator: expect.anything()
        })
      })

      it('fails when attempting to remove pre-installed dictionaries', () => {
        expect(() => stack.end()).toThrowError(DictStackUnderflow)
      })
    })
  })
})
