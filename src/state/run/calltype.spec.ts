import { SignalType, ValueType } from '@api'
import { executeRunTests } from '@test/run/execute'
import { calltype } from './calltype'
import { Undefined } from '@errors'

const LOOKUP = 1
const AFTER = 2

const host = {
  
}

describe('state/run/calltype', () => {
  executeRunTests(calltype, [{
    before: {
      callStack: [{
        type: ValueType.call,
        call: 'add'
      }]
    },
    after: {
      step: LOOKUP,
      result: {
        type: SignalType.beforeCall,
        debug: true,
        name: 'add'
      }
    }
  }, {
    before: {
      step: LOOKUP,
      callStack: [{
        type: ValueType.call,
        call: 'add'
      }]
    },
    after: {
      step: AFTER,
      result: {
        type: ValueType.operator,
        operator: expect.anything()
      }
    }
  }, {
    before: {
      step: LOOKUP,
      callStack: [{
        type: ValueType.call,
        call: 'nope'
      }],
    },
    error: Undefined
  }, {
    before: {
      step: AFTER,
      callStack: [{
        type: ValueType.call,
        call: 'add'
      }],
    },
    after: {
      result: {
        type: SignalType.afterCall,
        debug: true,
        name: 'add'
      }
    }
  }])
})
