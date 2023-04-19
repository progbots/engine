| **name** | **signature(s)** | **summary** |
|---|---|---|
| `add` | integer integer ⇒ integer | adds two integer |
| `aload` | array ⇒ any:1 ... any:N | dumps the content of the array on the [operand stack][operand stack] |
| `begin` | dict ⇒ ∅ | adds the dictionary to the top of the [dictionary stack][dictionary stack] |
| `bind` | proc ⇒ proc | replace proc calls with their actual implementation |
| `catch` | proc:safe proc:caught ⇒ ∅ | executes proc:safe and, if any exception occurs, executes proc:caught after adding the exception descriptor on the operand stack |
| `clear` | any:1 ... any:N ⇒ ∅ | clears the [operand stack][operand stack] |



[dictionary stack]: https://github.com/progbots/engine/blob/main/docs/README.md
[operand stack]: https://github.com/progbots/engine/blob/main/docs/README.md
