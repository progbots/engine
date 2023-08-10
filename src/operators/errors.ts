import { InternalError } from '../src/errors/InternalError'
import * as errorClasses from '../src/errors/operators'
import { CycleResult, OperatorFunction, State } from '../state/index'

const errorOperators: Record<string, OperatorFunction> = {}

Object.values(errorClasses).forEach((ErrorClass: new () => InternalError) => {
  const ErrorConstructor = ErrorClass

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
