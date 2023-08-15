import { OperatorAttributes, OperatorFunction } from '../state/types'
import { getKeys } from '../ts-helpers'

export function setOperatorAttributes (operator: OperatorFunction, attributes: OperatorAttributes): void {
  Object.defineProperties(operator, getKeys(attributes).reduce((
    properties: PropertyDescriptorMap,
    attributeName: keyof OperatorAttributes
  ): PropertyDescriptorMap => {
    properties[attributeName] = {
      value: attributes[attributeName],
      writable: false
    }
    return properties
  }, {}))
}
