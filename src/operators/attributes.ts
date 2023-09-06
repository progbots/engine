import { IOperatorAttributes, IOperatorFunction } from '@sdk'
import { getKeys } from '../ts-helpers'

interface IOperatorAttributesAndName extends IOperatorAttributes {
  name?: string
}

export function setOperatorAttributes<T1 = any, T2 = any, T3 = any> (
  operator: IOperatorFunction<T1, T2, T3>,
  attributes: IOperatorAttributesAndName
): void {
  Object.defineProperties(operator, getKeys(attributes).reduce((
    properties: PropertyDescriptorMap,
    attributeName: keyof IOperatorAttributesAndName
  ): PropertyDescriptorMap => {
    properties[attributeName] = {
      value: attributes[attributeName],
      writable: false
    }
    return properties
  }, {}))
}
