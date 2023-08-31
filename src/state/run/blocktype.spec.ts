import { SignalType, IArray, Value, ValueType } from '@api'
import { executeRunTests } from '@test/run/execute'
import { blocktype } from './blocktype'
import { CycleResult } from '@sdk'

const LOOP = 1
const STACK = 2

const operator = (): CycleResult => null

const block: IArray = {
  length: 3,
  at (index: number): Value {
    if (index === 0) {
      return {
        type: ValueType.integer,
        number: index
      }
    }
    if (index === 1) {
      return {
        type: ValueType.call,
        call: 'name'
      }
    }
    return {
      type: ValueType.operator,
      operator
    }
  }
}

describe('state/run/blocktype', () => {
  executeRunTests(blocktype, [{
    before: {
      callStack: [{
        type: ValueType.block,
        block
      }]
    },
    after: {
      step: LOOP,
      result: {
        type: SignalType.beforeBlock,
        debug: true,
        block
      },
      index: 0
    }
  }, {
    before: {
      step: LOOP,
      callStack: [{
        type: ValueType.block,
        block
      }],
      index: 0
    },
    after: {
      step: STACK,
      result: {
        type: SignalType.beforeBlockItem,
        debug: true,
        block,
        index: 0
      },
      index: 0
    }
  }, {
    before: {
      step: STACK,
      callStack: [{
        type: ValueType.block,
        block
      }],
      index: 0
    },
    after: {
      step: LOOP,
      operands: [{
        type: ValueType.integer,
        number: 0
      }],
      index: 1
    }
  }, {
    before: {
      step: STACK,
      callStack: [{
        type: ValueType.block,
        block
      }],
      index: 1
    },
    after: {
      step: LOOP,
      result: {
        type: ValueType.call,
        call: 'name'
      },
      index: 2
    }
  }, {
    before: {
      step: STACK,
      callStack: [{
        type: ValueType.block,
        block
      }],
      index: 2
    },
    after: {
      step: LOOP,
      result: {
        type: ValueType.operator,
        operator
      },
      index: 3
    }
  }, {
    before: {
      step: LOOP,
      callStack: [{
        type: ValueType.block,
        block
      }],
      index: 3
    },
    after: {
      result: {
        type: SignalType.afterBlock,
        debug: true,
        block
      }
    }
  }])
})
