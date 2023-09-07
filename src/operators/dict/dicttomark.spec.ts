import { TypeCheck, UnmatchedMark } from '@errors'
import { executeStateTests } from '@test/state/execute'

describe('operators/dict/dicttomark', () => {
  executeStateTests({
    'builds a dictionary from values in the stack': [{
      src: 'mark dicttomark length',
      expect: '0'
    }, {
      src: '"d" 3 "e" 4 mark "a" 0 "b" 1 "c" 2 dicttomark begin a b c end',
      expect: '"d" 3 "e" 4 0 1 2'
    }, {
      src: 'mark "test" { 1 2 add } dicttomark begin test end',
      expect: '3'
    }],
    'fails with UnmatchedMark if the stack does not contain a mark': {
      src: 'dicttomark',
      error: UnmatchedMark
    },
    'fails with TypeCheck if the stack does not contain the expected pairs': [{
      src: 'mark "key without value" dicttomark',
      error: TypeCheck
    }, {
      src: 'mark 0 "value" dicttomark',
      error: TypeCheck
    }, {
      src: 'mark "key" "value" "key2" dicttomark',
      error: TypeCheck
    }]
  })
})
