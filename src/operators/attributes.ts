import { IOperatorAttributes, IOperatorFunction } from '@sdk'
import { getKeys } from '../ts-helpers'
import { ValueType } from '@api'

interface IOperatorAttributesAndName extends IOperatorAttributes {
  name?: string
}

export function setOperatorAttributes<T1 extends ValueType, T2 extends ValueType, T3 extends ValueType> (
  operator: IOperatorFunction<T1, T2, T3>,
  attributes: IOperatorAttributesAndName,
  typeCheck1?: T1,
  typeCheck2?: T2,
  typeCheck3?: T3
): void {
  const typeCheck: ValueType[] = []
  if (typeCheck1 !== undefined) {
    typeCheck.push(typeCheck1)
  }
  if (typeCheck2 !== undefined) {
    typeCheck.push(typeCheck2)
  }
  if (typeCheck3 !== undefined) {
    typeCheck.push(typeCheck3)
  }
  const extendedAttributes = Object.assign({ typeCheck }, attributes)
  Object.defineProperties(operator, getKeys(extendedAttributes).reduce((
    properties: PropertyDescriptorMap,
    attributeName: keyof IOperatorAttributesAndName
  ): PropertyDescriptorMap => {
    properties[attributeName] = {
      value: extendedAttributes[attributeName],
      writable: false
    }
    return properties
  }, {}))
}
