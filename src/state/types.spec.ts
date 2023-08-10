import { IArray, IDictionary, Value, ValueType } from '../index'
import { checkBlockValue, checkBooleanValue, checkCallValue, checkDictValue, checkIntegerValue, checkOperatorValue, checkStringValue, isBlockValue, isBooleanValue, isCallValue, isDictValue, isIntegerValue, isOperatorValue, isStringValue } from './types'
import { executeCheckTests, checkTestsParameters } from '../src/test-helpers'
import { add } from '../operators'

const invalidData = [
  undefined,
  null,
  true, false,
  -1, 0, 1,
  '', 'hello world !',
  {},
  add
]

function typecheck ({ name, check, is, ok, ko }: checkTestsParameters, type: ValueType): void {
  executeCheckTests({
    name,
    check,
    is,
    ok: ok.map(data => ({ type, data })),
    ko: invalidData
      .filter(data => !ok.includes(data))
      .map(data => ({
        type,
        data
      }))
      .concat(ko)
  })
}

const iarray: IArray = {
  length: 1,
  at (index: number): Value {
    return {
      type: ValueType.integer,
      data: index
    }
  }
}

const notIArrays = [{
  length: -1,
  at (index: number): Value {
    return {
      type: ValueType.integer,
      data: index
    }
  }
}, {
  length: '123',
  at (index: number): Value {
    return {
      type: ValueType.integer,
      data: index
    }
  }
}, {
  at (index: number): Value {
    return {
      type: ValueType.integer,
      data: index
    }
  }
}, {
  length: 1,
  at (): void { }
}, {
}]

const idictionary: IDictionary = {
  names: ['a', 'b'],
  lookup (name: string): Value {
    return {
      type: ValueType.string,
      data: name
    }
  }
}

const notIDictionaries = [{
  names: -1,
  lookup (name: string): Value {
    return {
      type: ValueType.string,
      data: name
    }
  }
}, {
  names: 'abc',
  lookup (name: string): Value {
    return {
      type: ValueType.string,
      data: name
    }
  }
}, {
  lookup (name: string): Value {
    return {
      type: ValueType.string,
      data: name
    }
  }
}, {
  names: ['a', 'b'],
  lookup (): void {
  }
}, {
}]

describe('state/types', () => {
  typecheck({
    name: 'BooleanValue',
    check: checkBooleanValue,
    is: isBooleanValue,
    ok: [true, false],
    ko: []
  }, ValueType.boolean)

  typecheck({
    name: 'IntegerValue',
    check: checkIntegerValue,
    is: isIntegerValue,
    ok: [-1, 0, 1],
    ko: []
  }, ValueType.integer)

  typecheck({
    name: 'StringValue',
    check: checkStringValue,
    is: isStringValue,
    ok: ['', '0, 1', 'hello world !'],
    ko: []
  }, ValueType.string)

  typecheck({
    name: 'CallValue',
    check: checkCallValue,
    is: isCallValue,
    ok: ['add', '{', 'hello world !'],
    ko: []
  }, ValueType.call)

  typecheck({
    name: 'OperatorValue',
    check: checkOperatorValue,
    is: isOperatorValue,
    ok: [add],
    ko: []
  }, ValueType.operator)

  typecheck({
    name: 'BlockValue',
    check: checkBlockValue,
    is: isBlockValue,
    ok: [iarray],
    ko: notIArrays
  }, ValueType.block)

  typecheck({
    name: 'DictValue',
    check: checkDictValue,
    is: isDictValue,
    ok: [idictionary],
    ko: notIDictionaries
  }, ValueType.dict)
})
