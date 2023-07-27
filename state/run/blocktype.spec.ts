import { EngineSignalType, IArray, Value, ValueType } from '../../index'
import { blocktype } from './blocktype'
import { extractRunSteps, executeRunTests } from '../../test-helpers'
import { add } from '../../operators/index'
import { Undefined } from '../../errors/index'

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
    }
  })
})
