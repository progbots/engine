import { BaseError } from '../errors/BaseError'
import * as errorClasses from '../errors'
import { OperatorFunction, State } from '../state'

const errorOperators: Record<string, OperatorFunction> = {}

Object.values(errorClasses).forEach((ErrorClass: Function) => {
  if (['Internal', 'BusyParsing'].includes(ErrorClass.name)) {
    return // filter out
  }

  const ErrorConstructor = ErrorClass as (new () => BaseError)

  const operator = function * (state: State): Generator {
    throw new ErrorConstructor()
  }

  Object.defineProperty(operator, 'name', {
    value: ErrorClass.name.toLowerCase(),
    writable: false
  })

  errorOperators[operator.name] = operator
})

export default errorOperators
