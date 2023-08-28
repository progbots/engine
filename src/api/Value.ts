import { ArrayValue } from './ArrayValue'
import { BlockValue } from './BlockValue'
import { BooleanValue } from './BooleanValue'
import { CallValue } from './CallValue'
import { DictionaryValue } from './DictionaryValue'
import { IntegerValue } from './IntegerValue'
import { MarkValue } from './MarkValue'
import { OperatorValue } from './OperatorValue'
import { StringValue } from './StringValue'
import { ValueType } from './ValueType'

export type Value<T = any> = T extends ValueType.boolean ? BooleanValue
  : T extends ValueType.integer ? IntegerValue
    : T extends ValueType.string ? StringValue
      : T extends ValueType.mark ? MarkValue
        : T extends ValueType.block ? BlockValue
          : T extends ValueType.call ? CallValue
            : T extends ValueType.operator ? OperatorValue
              : T extends ValueType.array ? ArrayValue
                : T extends ValueType.dictionary ? DictionaryValue
                  : BooleanValue | IntegerValue | StringValue | MarkValue | BlockValue | CallValue | OperatorValue | ArrayValue | DictionaryValue
