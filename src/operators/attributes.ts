import { OperatorAttributes, OperatorFunction } from '../state/types'

const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>

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
