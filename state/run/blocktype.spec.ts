import { EngineSignalType, IArray, Value, ValueType } from '../../index'
import { blocktype } from './blocktype'
import { extractRunSteps, executeRunTests } from '../../test-helpers'

const steps = extractRunSteps(blocktype)
const array: IArray = {
  length: 2,
  at (index: number): Value {
    return {
      type: ValueType.integer,
      data: index
    }
  }
}

describe('state/run/blocktype', () => {
  executeRunTests(blocktype, {
    'init -> loop': {
      before: {
        callStack: [{
          type: ValueType.block,
          data: array
        }]
      },
      after: {
        step: steps.loop,
        result: {
          type: EngineSignalType.beforeBlock,
          debug: true,
          block: array
        },
        index: 0
      }
    },
    'loop -> stack': {
      before: {
        callStack: [{
          type: ValueType.block,
          data: array
        }],
        step: steps.loop,
        index: 0
      },
      after: {
        step: steps.stack,
        result: {
          type: EngineSignalType.beforeBlockItem,
          debug: true,
          block: array,
          index: 0
        },
        index: 0
      }
    },
    'stack -> loop': {
      before: {
        callStack: [{
          type: ValueType.block,
          data: array
        }],
        step: steps.stack,
        index: 0
      },
      after: {
        step: steps.loop,
        result: {
          type: ValueType.integer,
          data: 0
        },
        index: 1
      }
    },
    'loop -> ∅': {
      before: {
        callStack: [{
          type: ValueType.block,
          data: array
        }],
        step: steps.loop,
        index: 2
      },
      after: {
        step: -1,
        result: {
          type: EngineSignalType.afterBlock,
          debug: true,
          block: array
        }
      }
    }
  })
})
