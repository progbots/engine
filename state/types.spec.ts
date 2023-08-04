import { IArray, IDictionary, Value, ValueType } from '../index'
import { checkBlockValue, checkBooleanValue, checkDictValue, checkIntegerValue, isBlockValue, isBooleanValue, isDictValue, isIntegerValue } from './types'
import { executeCheckTests, checkTestsParameters } from '../test-helpers'

const invalidData = [
  undefined,
  null,
  true, false,
  -1, 0, 1,
  '', 'hello world !'
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
    ko: [{
      type: ValueType.boolean,
      data: {}
    }]
  }, ValueType.boolean)

  typecheck({
    name: 'IntegerValue',
    check: checkIntegerValue,
    is: isIntegerValue,
    ok: [-1, 0, 1],
    ko: [{
      type: ValueType.boolean,
      data: {}
    }]
  }, ValueType.integer)

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
