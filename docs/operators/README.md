| **name** | **signature(s)** | **summary** |
|---|---|---|
| `add` | integer integer ⇒ integer | adds two integer |
| `aload` | array ⇒ ... any | dumps the content of the array on the [operand stack][operand stack] |
| `apush` | array any ⇒ ∅ | pushes the value into the array |
| `begin` | dict ⇒ ∅ | adds the dictionary to the top of the [dictionary stack][dictionary stack] |
| `bind` | proc ⇒ proc | replace proc calls with their actual implementation |
| `catch` | proc:safe proc:caught ⇒ ∅ | executes proc:safe and, if any exception occurs, executes proc:caught after adding the exception descriptor on the operand stack |
| `clear` | ... ⇒ ∅ | clears the [operand stack][operand stack] |
| `cleartomark` | mark ... ⇒ ∅ | clears the [operand stack][operand stack] up to the first mark |
| `count` | ∅ ⇒ integer | returns the number of items in the [operand stack][operand stack] |
| `counttomark` | mark ... ⇒ mark ... integer | returns the number of items in the [operand stack][operand stack] up to the first mark |
| `currentdict` | ∅ ⇒ dict | returns the current dictionary, the one on the top of the [dictionary stack][dictionary stack] |
| `def` | string any ⇒ ∅ | sets the value in the current dictionary, the one on the top of the [dictionary stack][dictionary stack] |
| `dict` | ∅ ⇒ dict | creates a new dictionary |
| `dictstack` | ∅ ⇒ array&lt;dict&gt; | returns the content of the [dictionary stack][dictionary stack] |
| `dup` | any:1 ⇒ any:1 any:1 | duplicate the current operandm the one on the top of the [operand stack][operand stack] |
| `end` | ∅ ⇒ ∅ | removes the current dictionary from the top of the [dictionary stack][dictionary stack] |
| `eq` | any:1 any:0 ⇒ boolean | returns true if the two items are [strictly equal][strict comparison] |
| `exch` | any:1 any:0 ⇒ any:0 any:1 | swaps the top two items of the [operand stack][operand stack] |
| `false` | ∅ ⇒ boolean | false |
| `finally` | proc:safe proc:finally ⇒ ∅ | executes proc:safe and, even if an exception occurs, executes proc:finally |
| `get` | string integer:pos ⇒ integer | returns the character code at position pos _(0-based)_ in the string |
|  | array integer:pos ⇒ any | returns the item at position pos _(0-based)_ in the array |
|  | dict string:key ⇒ any | returns the value associated to the key in the dictionary |
|  | proc integer:pos ⇒ any | returns the item at position pos _(0-based)_ in the proc |
| `globaldict` | ∅ ⇒ dict | returns the **global** dictionary from the [dictionary stack][dictionary stack] |
| `if` | boolean proc ⇒ ∅ | executes the proc if the boolean is true |
| `ifelse` | boolean proc:if proc:else ⇒ ∅ | depending on the boolean value, executes either the proc:if or the proc:else |
| `index` | integer ⇒ any | get an item from the [operand stack][operand stack] based on its index (0-based) |
| `length` | string ⇒ integer | returns the length of the string|
|  | array ⇒ integer | returns the number of values in the array |
|  | dict ⇒ integer | returns the number of values in the dictionary |
|  | proc ⇒ integer | returns the number of values in the proc |
| `loop`  | proc ⇒ ∅ | executes the proc repeatedely (must use `break` to stop the loop) |
| `mark`  | ∅ ⇒ mark | mark |
| `neq` | any:1 any:0 ⇒ boolean | returns true if the two items are **not** [strictly equal][strict comparison] |
| `pop`  | any ⇒ ∅ | removes the top of the [operand stack][operand stack] |
| `roll`  | any:n-1 ... any:0 integer:n integer:j ⇒ any:(j-1)%n ... any:0 any:n-1 ... any:j%n | performs a circular shift of the objects anyn-1 through any0 on the [operand stack][operand stack] by the amount j. Positive j indicates upward motion on the stack, whereas negative j indicates downward motion.
| `set` | string integer:pos integer:code ⇒ string | update the character code at position pos _(0-based)_ in the string |
|  | array integer:pos any ⇒ array | updates the item at position pos _(0-based)_ in the array |
|  | dict string:key any ⇒ dict | updates the value associated to the key in the dictionary |
| `sub` | integer:1 integer:0 ⇒ integer | substracts two integer (integer:1 - integer:2) |
| `systemdict` | ∅ ⇒ dict | returns the **system** dictionary from the [dictionary stack][dictionary stack] |
| `throw` | dict => ∅ | throws a custom exception (based on dictionary `name` and `message`) |
|  | string => ∅ | throws a custom exception |
| `true` | ∅ ⇒ boolean | true |
| `type` | any ⇒ string | returns the type of the item on top of the [operand stack][operand stack] |

[dictionary stack]: https://github.com/progbots/engine/blob/main/docs/README.md
[operand stack]: https://github.com/progbots/engine/blob/main/docs/README.md
[strict comparison]: https://github.com/progbots/engine/blob/main/docs/README.md
