import { IArray, ValueType } from '..'
import { renderCallStack } from './callstack'
import { InternalValue } from '.'

interface TestCase {
  only?: boolean
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
  'shows parser with current token being a name': {
    calls: [{
      type: ValueType.integer,
      data: 4 // offset
    }, {
      type: ValueType.string,
      data: '1 2 /add'
    }],
    expected: '"1 2 »/add«"'
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
  'formats parsed content': {
    calls: [{
      type: ValueType.string,
      data: '\t1\n\t2\n\tadd'
    }],
    expected: '"⭲1↵⭲2↵⭲add"'
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
    const { only = false, calls, expected } = testCases[label]
    const test = (): void => expect(renderCallStack(iArray(calls))).toStrictEqual(expected)
    if (only) {
      it.only(label, test)
    } else {
      it(label, test)
    }
  })
})
