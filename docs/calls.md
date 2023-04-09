# Understanding the engine call stack

The [`IState`][interfaces] interface exposes the `calls` member which returns an [`IArray`][interfaces].
It is similar to the `operands` stack but it must be interpreted in a different way.

Depending on the [`ValueType`][interfaces], each call stack item indicates what the engine is currently processing. Sometimes, a call stack item must be associated with the next one.

## `ValueType.string`

This kind of call stack item represents a call to the `parser`. It is generally preceded by a `ValueType.integer` indicating which offset of the string is currently being processed.

## `ValueType.proc`

This kind of call stack item is added whenever the engine is evaluated a procedure. It is generally preceded by a `ValueType.integer` indicating which item in the procedure is currently being processed.

## `ValueType.call`

Represents a lookup of a name in dictionaries. As a next step, it is preceded by the retrieved value.

## `ValueType.operator`

Represents the execution of an operator. If the operator includes several steps (like for [`bind`][operators] or [`loop`][operators]), it is preceded by `ValueType.integer` providing the step / iteration information.

[interfaces]: https://github.com/progbots/engine/blob/main/index.ts
[operators]: https://github.com/progbots/engine/blob/main/docs/operators/README.md