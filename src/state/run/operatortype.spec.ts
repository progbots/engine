import { EngineSignalType, IArray, Value, ValueType } from '../../index'
import { operatortype } from './operatortype'
import { extractRunSteps, executeRunTests } from '../../src/test-helpers'
import { RUN_STEP_END } from './types'

const steps = extractRunSteps(operatortype)

describe('state/run/operatortype', () => {
  executeRunTests(operatortype, {
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
        step: RUN_STEP_END,
        result: {
          type: EngineSignalType.afterBlock,
          debug: true,
          block: array
        }
      }
    }
  })
})
