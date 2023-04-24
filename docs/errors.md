
| **name** | **operator** | **summary** |
|---|---|---|
| `Break` | `break` | breaks the inner loop. If not in a loop, generates an `InvalidBreak` error |
| `BusyParsing` | | triggered if `parse` is invoked before the last `parse` completes |
| `Custom` | `throw` | custom error |
| `DictStackUnderflow` | | when `end` is used to unstack a dictionary from the dictionary stack but no more custom dictionary can be removed |
| `Internal` | | any internal error | 
| `InvalidAccess` | `invalidaccess` | when trying to write on a read-only object | 
| `InvalidBreak` | | see `break` |
| `RangeCheck` | `rangecheck` | out of range error (for instance accessing item index with index > range or < 0) |
| `StackUnderflow` | `stackunderflow` | not enough operands on the stack to perform the operation |
| `TypeCheck` | `typecheck` | invalid operand type |
| `Undefined` | `undefined` | |
| `UnmatchedMark` | `unmatchedmark` | |
| `VMerror` | `vmwerror` | Not enough memory to perform the operation |
