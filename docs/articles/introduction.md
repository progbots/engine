# Introduction to PBS engine

This article introduces of the elements that make the PBS engine *unique*.
The design is largely inspired from the [PostScript language](https://en.wikipedia.org/wiki/PostScript)
but modified to fit specific needs.

## The language syntax

The language syntax is very basic and does not implement complex validation rules.

The engine manipulate values which are typed with :

| Value type | Description | Examples |
|---|---|---|
| `"booleantype"` | A boolean value | `true`, `false` |
| `"integertype"` | An integer value | `0`, `-1`, `10` |
| `"stringtype"` | A string | `"hello world"` |
| `"calltype"` | A name that will be resolved to another value |`add`, `{`, `[` |
| `"operator"` | A native operator | |
| `"marktype"` | A marker | `mark` |
| `"arraytype"` | An array | `[ ]`, `[ 0 true ]` |
| `"dicttype"` | A dictionary mapping names to values | `systemdict` |
| `"blocktype"` | An array of values | `{ 0 true }`
| `"proctype"` | |

### Comments

The character '%' introduces a line comment.

### Numbers

...Number range
Memory consideration

### Strings

...String length
Memory consideration
  (big string vs small string)

### Calls


... Almost as a string from a memory point of view

### Arrays

Shared references,
modifying an array modifies all its references
It *is* possible to create a reference loop with arrays

```text
mark
  "a" ["a"]
  "b" ["b"]
dicttomark
begin
a b apush
b a apush
end % memory is not freed
```

### Dictionaries

Shared references
Used in particular for the dictionary stack

### Blocks

"Executable" Array 

### Procedures

"Executable" blocks
A block becomes a proc when defined in a dictionary (`def`)

## The engine state

### Memory

### Dictionary stack

Used for resolution of calls

### Operand stack

Used for operators execution

### Call stack

Managed internally but enables to see where the execution is

### Engine signals

The engine can throw signals

## Hello World

## Running

### The host dictionary

## Debugging
