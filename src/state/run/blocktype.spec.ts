import { SignalType, IArray, Value, ValueType } from '@api'
import { executeRunTests } from '@test/run/execute'
import { RUN_STEP_END } from './RunSteps'
import { blocktype } from './blocktype'

const LOOP = 1
const STACK = 2

const block: IArray = {
  length: 2,
  at (index: number): Value {
    return {
      type: ValueType.integer,
      number: index
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
      result: {
        type: ValueType.integer,
        number: 0
      },
      index: 1
    }
  }, {
    before: {
      step: LOOP,
      callStack: [{
        type: ValueType.block,
        block
      }],
      index: 2
    },
    after: {
      step: RUN_STEP_END,
      result: {
        type: SignalType.afterBlock,
        debug: true,
        block
      }
    }
  }])
})
