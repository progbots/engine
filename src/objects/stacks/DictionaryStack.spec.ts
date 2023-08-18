import { DictStackUnderflow, Undefined } from '../../errors/index'
import { IDictionary, Value, ValueType } from '../../index'
import { MemoryTracker } from '../../state/MemoryTracker'
import { Dictionary } from '../dictionaries/index'
import { DictionaryStack, DictionaryStackWhereResult } from './DictionaryStack'

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
      const expected: DictionaryStackWhereResult = {
        dictionary: stack.systemdict,
        value: {
          type: ValueType.operator,
          operator: expect.anything()
        }
      }
      expect(stack.where('clear')).toStrictEqual(expected)
    })

    it('searches for a known name (from globaldict)', () => {
      stack.globaldict.def('clear', {
        type: ValueType.string,
        string: 'my_clear'
      })
      const expected: DictionaryStackWhereResult = {
        dictionary: stack.globaldict,
        value: {
          type: ValueType.string,
          string: 'my_clear'
        }
      }
      expect(stack.where('clear')).toStrictEqual(expected)
    })

    it('returns null if the name is not found in the stack', () => {
      expect(stack.where('unknown')).toStrictEqual(null)
    })

    describe('with a host dictionary', () => {
      it('resolves host name', () => {
        const stackWithHost = new DictionaryStack(tracker, host)
        const expected: DictionaryStackWhereResult = {
          dictionary: host,
          value: {
            type: ValueType.string,
            string: 'localhost'
          }
        }
        expect(stackWithHost.where('hostname')).toStrictEqual(expected)
      })
    })
  })

  describe('lookup', () => {
    it('searches for a known name (from systemdict)', () => {
      const expected: Value = {
        type: ValueType.operator,
        operator: expect.anything()
      }
      expect(stack.lookup('clear')).toStrictEqual(expected)
    })

    it('searches for a known name (from globaldict)', () => {
      const expected: Value = {
        type: ValueType.string,
        string: 'my_clear'
      }
      stack.globaldict.def('clear', expected)
      expect(stack.lookup('clear')).toStrictEqual(expected)
    })

    it('fails with Undefined if the name is not found in the stack', () => {
      expect(() => stack.lookup('unknown')).toThrowError(Undefined)
    })

    describe('with a host dictionary', () => {
      it('resolves host name', () => {
        const stackWithHost = new DictionaryStack(tracker, host)
        const expected: Value = {
          type: ValueType.string,
          string: 'localhost'
        }
        expect(stackWithHost.lookup('hostname')).toStrictEqual(expected)
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
      const expected: Value = {
        type: ValueType.string,
        string: 'another_clear'
      }
      expect(stack.lookup('clear')).toStrictEqual(expected)
    })

    describe('end', () => {
      beforeEach(() => {
        stack.end()
      })

      it('removes the top dictionary from the stack', () => {
        const expected: Value = {
          type: ValueType.operator,
          operator: expect.anything()
        }
        expect(stack.lookup('clear')).toStrictEqual(expected)
      })

      it('fails when attempting to remove pre-installed dictionaries', () => {
        expect(() => stack.end()).toThrowError(DictStackUnderflow)
      })
    })
  })
})
