import { ArrayValue } from './ArrayValue'
import { BlockValue } from './BlockValue'
import { BooleanValue } from './BooleanValue'
import { CallValue } from './CallValue'
import { DictionaryValue } from './DictionaryValue'
import { IntegerValue } from './IntegerValue'
import { MarkValue } from './MarkValue'
import { OperatorValue } from './OperatorValue'
import { StringValue } from './StringValue'

export type Value =
  BooleanValue |
  IntegerValue |
  StringValue |
  MarkValue |
  BlockValue |
  CallValue |
  OperatorValue |
  ArrayValue |
  DictionaryValue
