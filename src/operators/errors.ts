import { BaseError } from '@errors'
import * as errorClasses from '@errors/operators'
import { CycleResult, IOperatorFunction, IInternalState } from '@sdk'

const errorOperators: Record<string, IOperatorFunction> = {}

Object.values(errorClasses).forEach((ErrorClass: new () => BaseError) => {
  const ErrorConstructor = ErrorClass

  const operator = function (state: IInternalState): CycleResult {
    throw new ErrorConstructor()
  }

  Object.defineProperty(operator, 'name', {
    value: ErrorClass.name.toLowerCase(),
    writable: false
  })

  errorOperators[operator.name] = operator
})

export default errorOperators
