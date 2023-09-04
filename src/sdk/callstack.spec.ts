import { ValueType } from '@api'
import { CycleResult, InternalValue } from '@sdk'
import { renderCallStack } from './callstack'
import { toIArray } from '@test/toIArray'

interface TestCase {
  only?: boolean
  calls: InternalValue[]
  expected: string
}

const testCases: Record<string, TestCase> = {
  'shows parsed string': {
    calls: [{
      type: ValueType.string,
      string: '1 2 add'
    }],
    expected: '"1 2 add"'
  },
  'shows parsed string with current token': {
    calls: [{
      type: ValueType.integer,
      number: 2
    }, {
      type: ValueType.string,
      string: '1 2 add'
    }],
    expected: '"1 »2« add"'
  },
  'shows parsed string with current token being a name': {
    calls: [{
      type: ValueType.integer,
      number: 4
    }, {
      type: ValueType.string,
      string: '1 2 /add'
    }],
    expected: '"1 2 »/add«"'
  },
  'shows parser with current token and debug info': {
    calls: [{
      type: ValueType.integer,
      number: 2
    }, {
      type: ValueType.string,
      string: '1 2 add',
      debug: {
        source: '1 2 add',
        filename: 'test.ps',
        pos: 0,
        length: 7
      }
    }],
    expected: '"1 »2« add" @test.ps:2'
  },
  'formats parsed content': {
    calls: [{
      type: ValueType.string,
      string: '\t1\n\t2\n\tadd'
    }],
    expected: '"⭲1↵⭲2↵⭲add"'
  },
  'shows operator and call': {
    calls: [{
      type: ValueType.operator,
      operator: function test (): CycleResult { return null }
    }, {
      type: ValueType.call,
      call: 'test',
      debug: {
        source: 'test',
        filename: 'test.ps',
        pos: 0,
        length: 4
      }
    }],
    expected: '-test-\ntest @test.ps:0'
  },
  'shows operator and call progress': {
    calls: [{
      type: ValueType.integer,
      number: 2
    }, {
      type: ValueType.operator,
      operator: function test (): CycleResult { return null }
    }, {
      type: ValueType.call,
      call: 'test',
      debug: {
        source: 'test',
        filename: 'test.ps',
        pos: 0,
        length: 4
      }
    }],
    expected: '-test-:2\ntest @test.ps:0'
  },
  'shows block': {
    calls: [{
      type: ValueType.block,
      block: toIArray([{
        type: ValueType.integer,
        number: 1
      }, {
        type: ValueType.integer,
        number: 2
      }, {
        type: ValueType.call,
        call: 'add'
      }])
    }],
    expected: '{ 1 2 add }'
  },
  'shows block with current value': {
    calls: [{
      type: ValueType.integer,
      number: 1
    }, {
      type: ValueType.block,
      block: toIArray([{
        type: ValueType.integer,
        number: 1
      }, {
        type: ValueType.integer,
        number: 2
      }, {
        type: ValueType.call,
        call: 'add'
      }])
    }],
    expected: '{ 1 »2« add }'
  },
  'formats unexpected items as an error': {
    calls: [{
      type: ValueType.mark
    }],
    expected: '/!\\ unexpected stack item type marktype'
  }
}

describe('callstack', () => {
  Object.keys(testCases).forEach(label => {
    const testCase = testCases[label]
    if (testCase === undefined) {
      return
    }
    const { only = false, calls, expected } = testCase
    const test = (): void => expect(renderCallStack(toIArray(calls))).toStrictEqual(expected)
    if (only) {
      it.only(label, test)
    } else {
      it(label, test)
    }
  })
})
