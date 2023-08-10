import { EngineSignalType, ValueType } from '../../index'
import { calltype } from './calltype'
import { extractRunSteps, executeRunTests } from '../../src/test-helpers'
import { add } from '../../operators/index'
import { Undefined } from '../../src/errors/index'
import { RUN_STEP_END } from './types'

const steps = extractRunSteps(calltype)

describe('state/run/calltype', () => {
  executeRunTests(calltype, {
    'init -> lookup': {
      before: {
        callStack: [{
          type: ValueType.call,
          data: 'add'
        }]
      },
      after: {
        step: steps.lookup,
        result: {
          type: EngineSignalType.beforeCall,
          debug: true,
          name: 'add'
        }
      }
    },
    'lookup -> after': {
      before: {
        callStack: [{
          type: ValueType.call,
          data: 'add'
        }],
        step: steps.lookup
      },
      after: {
        step: steps.after,
        result: {
          type: ValueType.operator,
          data: add
        }
      }
    },
    'lookup -> after (undefined)': {
      before: {
        callStack: [{
          type: ValueType.call,
          data: 'dda'
        }],
        step: steps.lookup
      },
      error: Undefined
    },
    'after -> ∅': {
      before: {
        callStack: [{
          type: ValueType.call,
          data: 'add'
        }],
        step: steps.after
      },
      after: {
        step: RUN_STEP_END,
        result: {
          type: EngineSignalType.afterCall,
          debug: true,
          name: 'add'
        }
      }
    }
  })
})
