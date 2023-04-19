| **name** | **signature(s)** | **summary** |
|---|---|---|
| `add` | integer integer ⇒ integer | adds two integer |
| `aload` | array ⇒ ... any:N | dumps the content of the array on the [operand stack][operand stack] |
| `begin` | dict ⇒ ∅ | adds the dictionary to the top of the [dictionary stack][dictionary stack] |
| `bind` | proc ⇒ proc | replace proc calls with their actual implementation |
| `catch` | proc:safe proc:caught ⇒ ∅ | executes proc:safe and, if any exception occurs, executes proc:caught after adding the exception descriptor on the operand stack |
| `clear` | ... ⇒ ∅ | clears the [operand stack][operand stack] |
| `cleartomark` | mark ... ⇒ ∅ | clears the [operand stack][operand stack] up to the first mark |
| `count` | ∅ ⇒ integer | returns the number of items in the [operand stack][operand stack] |
| `counttomark` | mark ... ⇒ mark ... integer | returns the number of items in the [operand stack][operand stack] up to the first mark |
| `currentdict` | ∅ ⇒ dict | returns the current dictionary, the one on the top of the [dictionary stack][dictionary stack] |
| `def` | name any ⇒ ∅ | sets the value in the current dictionary, the one on the top of the [dictionary stack][dictionary stack] |
| `dict` | ∅ ⇒ dict | creates a new dictionary |
| `dictstack` | ∅ ⇒ array&lt;dict&gt; | returns the content of the [dictionary stack][dictionary stack] |
| `dup` | any:1 ⇒ any:1 any:1 | duplicate the current operandm the one on the top of the [operand stack][operand stack] |
| `end` | ∅ ⇒ ∅ | removes the current dictionary from the top of the [dictionary stack][dictionary stack] |
| `eq` | any:1 any:2 ⇒ boolean | returns true if the two items are [strictly equal][strict comparison] |
| `exch` | any:1 any:2 ⇒ any:2 any:1 | swaps the top two items of the [operand stack][operand stack] |

[dictionary stack]: https://github.com/progbots/engine/blob/main/docs/README.md
[operand stack]: https://github.com/progbots/engine/blob/main/docs/README.md
[strict comparison]: https://github.com/progbots/engine/blob/main/docs/README.md
