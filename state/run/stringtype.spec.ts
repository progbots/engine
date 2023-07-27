import { EngineSignalType, ValueType } from '../../index'
import { stringtype } from './stringtype'
import { extractRunSteps, executeRunTests } from '../../test-helpers'

const steps = extractRunSteps(stringtype)

describe('state/run/stringtype', () => {
  const source = '1 2 add'
  const sourceFile = 'test.ps'

  executeRunTests(stringtype, {
    'init -> start': {
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
    'start -> stack': {
      before: {
        callStack: [{
          type: ValueType.string,
          data: source,
          sourceFile
        }],
        step: steps.start
      },
      after: {
        step: steps.stack,
        result: {
          type: EngineSignalType.tokenParsed,
          debug: true,
          source,
          sourceFile,
          sourcePos: 0,
          token: '1'
        },
        index: 0,
        parameters: [{
          type: ValueType.integer,
          data: 1
        }, {
          type: ValueType.integer,
          data: 1
        }]
      }
    },
    'start -> stack (debug)': {
      before: {
        flags: {
          keepDebugInfo: true
        },
        callStack: [{
          type: ValueType.string,
          data: source,
          sourceFile
        }],
        step: steps.start
      },
      after: {
        step: steps.stack,
        result: {
          type: EngineSignalType.tokenParsed,
          debug: true,
          source,
          sourceFile,
          sourcePos: 0,
          token: '1'
        },
        index: 0,
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
    'next -> stack': {
      before: {
        callStack: [{
          type: ValueType.string,
          data: source,
          sourceFile
        }],
        step: steps.next,
        parameters: [{
          type: ValueType.integer,
          data: 1
        }, {
          type: ValueType.integer,
          data: 1
        }]
      },
      after: {
        step: steps.stack,
        result: {
          type: EngineSignalType.tokenParsed,
          debug: true,
          source,
          sourceFile,
          sourcePos: 2,
          token: '2'
        },
        index: 1,
        parameters: [{
          type: ValueType.integer,
          data: 2
        }, {
          type: ValueType.integer,
          data: 3
        }]
      }
    },
    'next -> stack (debug)': {
      before: {
        flags: {
          keepDebugInfo: true
        },
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
        step: steps.stack,
        result: {
          type: EngineSignalType.tokenParsed,
          debug: true,
          source,
          sourceFile,
          sourcePos: 2,
          token: '2'
        },
        index: 1,
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
    },
    'stack -> next': {
      before: {
        callStack: [{
          type: ValueType.string,
          data: source,
          sourceFile
        }],
        step: steps.stack,
        parameters: [{
          type: ValueType.integer,
          data: 2
        }, {
          type: ValueType.integer,
          data: 3
        }]
      },
      after: {
        step: steps.next,
        result: {
          type: ValueType.integer,
          data: 2
        },
        parameters: [{
          type: ValueType.integer,
          data: 2
        }, {
          type: ValueType.integer,
          data: 3
        }]
      }
    },
    'stack -> next (debug)': {
      before: {
        flags: {
          keepDebugInfo: true
        },
        callStack: [{
          type: ValueType.string,
          data: source,
          sourceFile
        }],
        step: steps.stack,
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
      },
      after: {
        step: steps.next,
        result: {
          type: ValueType.integer,
          data: 2,
          source,
          sourceFile,
          sourcePos: 2
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
    },
    'next -> ∅': {
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
    }
  })
})
