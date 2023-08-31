import { SignalType, ValueType } from '@api'
import { executeRunTests } from '@test/run/execute'
import { calltype } from './calltype'
import { Undefined } from '@errors'
import { toIArray } from '@test/toIArray'
import { DictionaryMapping } from '@test/toIDictionary'

const LOOKUP = 1
const AFTER = 2

const host: DictionaryMapping = {
  integer: 1,
  string: '2',
  call: {
    type: ValueType.call,
    call: 'help'
  },
  block: {
    type: ValueType.block,
    block: toIArray([])
  }
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
      }]
    },
    error: Undefined
  }, {
    before: {
      step: LOOKUP,
      host,
      callStack: [{
        type: ValueType.call,
        call: 'integer'
      }]
    },
    after: {
      step: AFTER,
      operands: [{
        type: ValueType.integer,
        number: 1
      }]
    }
  }, {
    before: {
      step: LOOKUP,
      host,
      callStack: [{
        type: ValueType.call,
        call: 'string'
      }]
    },
    after: {
      step: AFTER,
      operands: [{
        type: ValueType.string,
        string: '2'
      }]
    }
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
