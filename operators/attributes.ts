import { OperatorAttributes } from '../state/types'

export function setOperatorAttributes (operator: Function, attributes: OperatorAttributes): void {
  Object.defineProperties(operator, Object.keys(attributes).reduce((
    properties: PropertyDescriptorMap,
    attributeName: string
  ): PropertyDescriptorMap => {
    properties[attributeName] = {
      value: attributes[attributeName as keyof OperatorAttributes],
      writable: false
    }
    return properties
  }, {}))
}
