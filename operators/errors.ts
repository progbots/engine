import { InternalError } from '../errors/InternalError'
import * as errorClasses from '../errors/index'
import { CycleResult, OperatorFunction, State } from '../state/index'

const errorOperators: Record<string, OperatorFunction> = {}
const noOperators = [
  'BusyParsing',
  'DictStackUnderflow',
  'Internal',
  'InvalidBreak'
]

Object.values(errorClasses).forEach((ErrorClass: Function) => {
  if (noOperators.includes(ErrorClass.name)) {
    return // filter out
  }

  const ErrorConstructor = ErrorClass as (new () => InternalError)

  const operator = function (state: State): CycleResult {
    throw new ErrorConstructor()
  }

  Object.defineProperty(operator, 'name', {
    value: ErrorClass.name.toLowerCase(),
    writable: false
  })

  errorOperators[operator.name] = operator
})

export default errorOperators
