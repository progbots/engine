import { RangeCheck, StackUnderflow, TypeCheck, Undefined } from '../errors/index'
import { executeTests } from '../test-helpers'

describe('operators/errors', () => {
  executeTests({
    'it throws RangeCheck': {
      src: 'rangecheck',
      error: RangeCheck
    },
    'it throws StackUnderflow': {
      src: 'stackunderflow',
      error: StackUnderflow
    },
    'it throws TypeCheck': {
      src: 'typecheck',
      error: TypeCheck
    },
    'it does not know busyparsing': {
      src: 'busyparsing',
      error: Undefined
    },
    'it does not know dictstackunderflow': {
      src: 'dictstackunderflow',
      error: Undefined
    },
    'it does not know internal': {
      src: 'internal',
      error: Undefined
    },
    'it does not know invalidbreak': {
      src: 'invalidbreak',
      error: Undefined
    }
  })
})
