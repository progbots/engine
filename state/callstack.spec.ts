import { IArray, ValueType } from '..'
import { renderCallStack } from './callstack'
import { InternalValue } from '.'

interface TestCase {
  calls: InternalValue[]
  expected: string
}

const iArray = (array: InternalValue[]): IArray => ({
  length: array.length,
  at: (index: number): InternalValue => array[index]
})

const testCases: Record<string, TestCase> = {
  'shows parser': {
    calls: [{
      type: ValueType.string,
      data: '1 2 add'
    }],
    expected: '"1 2 add"'
  },
  'shows parser with current token': {
    calls: [{
      type: ValueType.integer,
      data: 2 // offset
    }, {
      type: ValueType.string,
      data: '1 2 add'
    }],
    expected: '"1 »2« add"'
  },
  'shows parser with current token and debug info': {
    calls: [{
      type: ValueType.integer,
      data: 2
    }, {
      type: ValueType.string,
      data: '1 2 add',
      sourceFile: 'test.ps',
      sourcePos: 0
    }],
    expected: '"1 »2« add" @test.ps:0'
  },
  'shows operator and call': {
    calls: [{
      type: ValueType.operator,
      data: function * test (): Generator {}
    }, {
      type: ValueType.call,
      data: 'test',
      sourceFile: 'test.ps',
      sourcePos: 0
    }],
    expected: '-test-\ntest @test.ps:0'
  },
  'shows proc': {
    calls: [{
      type: ValueType.proc,
      data: iArray([{
        type: ValueType.integer,
        data: 1
      }, {
        type: ValueType.integer,
        data: 2
      }, {
        type: ValueType.call,
        data: 'add'
      }])
    }],
    expected: '{ 1 2 add }'
  },
  'shows proc with current value': {
    calls: [{
      type: ValueType.integer,
      data: 1
    }, {
      type: ValueType.proc,
      data: iArray([{
        type: ValueType.integer,
        data: 1
      }, {
        type: ValueType.integer,
        data: 2
      }, {
        type: ValueType.call,
        data: 'add'
      }])
    }],
    expected: '{ 1 »2« add }'
  }
}

describe('callstack', () => {
  Object.keys(testCases).forEach(label => {
    const { calls, expected } = testCases[label]
    it(label, () => expect(renderCallStack(iArray(calls))).toStrictEqual(expected))
  })
})
