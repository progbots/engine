import { IOperatorAttributes, IOperatorFunction } from '@sdk'
import { getKeys } from '../ts-helpers'

export function setOperatorAttributes (operator: IOperatorFunction, attributes: IOperatorAttributes): void {
  Object.defineProperties(operator, getKeys(attributes).reduce((
    properties: PropertyDescriptorMap,
    attributeName: keyof IOperatorAttributes
  ): PropertyDescriptorMap => {
    properties[attributeName] = {
      value: attributes[attributeName],
      writable: false
    }
    return properties
  }, {}))
}
