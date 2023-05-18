# Understanding the engine call stack

The [`IState`][interfaces] interface exposes the `calls` member returning an [`IArray`][interfaces].
It looks similar to the [operand stack][operand stack] but represents the **call stack** and must be interpreted in a different way.

Depending on the [`ValueType`][interfaces], each element indicates what the engine is currently processing.
Often, this element must be associated with the previous one ([`ValueType.integer`][interfaces]) to refine interpretation.

> Should we expose the callstack renderer ?

## `ValueType.string`

This item type represents a call to [`IState.parse`][interfaces].
When preceded by a [`ValueType.integer`][interfaces], it indicates which offset of the parsed string is currently being processed *(if not, it means the parsing just started)*.

For instance :
```json
[{
  "type": "integertype",
  "data": 2
}, {
  "type": "stringtype",
  "data": "1 2 add"
}]
```

represents the following call stack :
```text
"1 »2« add"
```

**NOTE** : when the currently parsed item is a simple value type ([`ValueType.integer`][interfaces], [`ValueType.string`][interfaces]), the value is pushed directly to the [operand stack][operand stack] without any additional call item.

## `ValueType.call`

This item type represents the lookup of a name in the [dictionary stack][dictionary stack].
It is an important step because when the name cannot be resolved, the engine will throw the [`Undefined` error][errors] and the faulty name is documented in the call stack.

From an execution point of view, the engine executes a cycle *before* doing the lookup
As a next step, it is preceded by the retrieved value.


For instance :
```json
[{
  "type": "calltype",
  "data": "add"
}, {
  "type": "integertype",
  "data": 4
}, {
  "type": "stringtype",
  "data": "1 2 add"
}]
```

represents the following call stack :
```text
add
"1 2 »add«"
```

For instance :
```json
[{
  "type": "operatortypr",
  "data": {}
}, {
  "type": "calltype",
  "data": "add"
}, {
  "type": "integertype",
  "data": 4
}, {
  "type": "stringtype",
  "data": "1 2 add"
}]
```

represents the following call stack :
```text
-add-
add
"1 2 »add«"
```

## `ValueType.proc`

This kind of item is present when the engine is evaluating a procedure. It is generally preceded by a `ValueType.integer` indicating which item *(0-based)* in the procedure is currently being processed *(if not, it means the procedure has just been resolved)*.

For instance :
```json
[{
  "type": "integertype",
  "data": 1
}, {
  "type": "proctype",
  "data": {}
}]
```

represents the following stack :
```text
{ 1 »2« add }
```



## `ValueType.operator`

Represents the execution of an operator. If the operator includes several steps (like for [`bind`][operators] or [`loop`][operators]), it is preceded by `ValueType.integer` providing the step / iteration information.

[interfaces]: https://github.com/progbots/engine/blob/main/index.ts
[operators]: https://github.com/progbots/engine/blob/main/docs/operators/README.md
[operand stack]: https://github.com/progbots/engine/blob/main/docs/README.md
[dictionary stack]: https://github.com/progbots/engine/blob/main/docs/README.md
[errors]: https://github.com/progbots/engine/blob/main/docs/errors.md