import { EngineSignalType, ValueType } from '../../index'
import { stringtype } from './stringtype'
import { extractRunSteps, executeRunTests } from '../../test-helpers'

const steps = extractRunSteps(stringtype)

describe('state/run/parse', () => {
  const source = '1 2 add'
  const sourceFile = 'test.ps'

  executeRunTests(stringtype, {
    '0: init': {
      before: {
        callStack: [{
          type: ValueType.string,
          data: source,
          sourceFile
        }]
      },
      after: {
        step: steps.start,
        result: {
          type: EngineSignalType.beforeParse,
          debug: true,
          source,
          sourceFile
        }
      }
    },
    '1: start': {
      before: {
        callStack: [{
          type: ValueType.string,
          data: source,
          sourceFile
        }],
        step: steps.start
      },
      after: {
        step: steps.submit,
        result: {
          type: EngineSignalType.tokenParsed,
          debug: true,
          source,
          sourceFile,
          sourcePos: 0,
          token: '1'
        },
        parameters: [{
          type: ValueType.integer,
          data: 1,
          source,
          sourceFile,
          sourcePos: 0
        }, {
          type: ValueType.integer,
          data: 1
        }]
      }
    },
    '2: next': [{
      before: {
        callStack: [{
          type: ValueType.string,
          data: source,
          sourceFile
        }],
        step: steps.next,
        parameters: [{
          type: ValueType.integer,
          data: 1,
          source,
          sourceFile,
          sourcePos: 0
        }, {
          type: ValueType.integer,
          data: 1
        }]
      },
      after: {
        step: steps.submit,
        result: {
          type: EngineSignalType.tokenParsed,
          debug: true,
          source,
          sourceFile,
          sourcePos: 2,
          token: '2'
        },
        parameters: [{
          type: ValueType.integer,
          data: 2,
          source,
          sourceFile,
          sourcePos: 2
        }, {
          type: ValueType.integer,
          data: 3
        }]
      }
    }, {
      before: {
        callStack: [{
          type: ValueType.string,
          data: source,
          sourceFile
        }],
        step: steps.next,
        parameters: [{
          type: ValueType.call,
          data: 'add',
          source,
          sourceFile,
          sourcePos: 4
        }, {
          type: ValueType.integer,
          data: 7
        }]
      },
      after: {
        step: -1,
        result: {
          type: EngineSignalType.afterParse,
          debug: true,
          source,
          sourceFile
        }
      }
    }]
  })
})
