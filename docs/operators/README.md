| **name** | **signature(s)** | **summary** |
|---|---|---|
| `add` | integer:a integer:b ⇒ integer:a+b | adds two integer |
| `aload` | array ⇒ ... any | dumps the content of the array on the [operand stack][operand stack] |
| `apush` | array any ⇒ ∅ | pushes the value into the array |
| `begin` | dict ⇒ ∅ | adds the dictionary to the top of the [dictionary stack][dictionary stack] |
| `bind` | block ⇒ block | replace block calls with their actual implementation |
| `catch` | block:safe block:caught ⇒ ∅ | executes block:safe and, if any exception occurs, executes block:caught after adding the exception descriptor on the operand stack |
| `clear` | ... ⇒ ∅ | clears the [operand stack][operand stack] |
| `cleartomark` | mark ... ⇒ ∅ | clears the [operand stack][operand stack] up to the first mark |
| `count` | ∅ ⇒ integer | returns the number of items in the [operand stack][operand stack] |
| `counttomark` | mark ... ⇒ mark ... integer | returns the number of items in the [operand stack][operand stack] up to the first mark |
| `currentdict` | ∅ ⇒ dict | returns the current dictionary, the one on the top of the [dictionary stack][dictionary stack] |
| `def` | string any ⇒ ∅ | defines a value in the current dictionary, the one on the top of the [dictionary stack][dictionary stack] |
| | string block ⇒ ∅ | defines a **procedure** in the current dictionary, the one on the top of the [dictionary stack][dictionary stack] |
| `dict` | ∅ ⇒ dict | creates a new dictionary |
| `dictstack` | ∅ ⇒ array&lt;dict&gt; | returns the content of the [dictionary stack][dictionary stack] |
| `dup` | any:1 ⇒ any:1 any:1 | duplicate the current operandm the one on the top of the [operand stack][operand stack] |
| `end` | ∅ ⇒ ∅ | removes the current dictionary from the top of the [dictionary stack][dictionary stack] |
| `eq` | any:1 any:0 ⇒ boolean | returns true if the two items are [strictly equal][strict comparison] |
| `exch` | any:1 any:0 ⇒ any:0 any:1 | swaps the top two items of the [operand stack][operand stack] |
| `false` | ∅ ⇒ boolean | false |
| `finally` | block:safe block:finally ⇒ ∅ | executes block:safe and, even if an exception occurs, executes block:finally |
| `get` | string integer:pos ⇒ integer | returns the character code at position pos _(0-based)_ in the string |
|  | array integer:pos ⇒ any | returns the item at position pos _(0-based)_ in the array |
|  | dict string:name ⇒ any | returns the value associated to the name in the dictionary |
|  | block integer:pos ⇒ any | returns the item at position pos _(0-based)_ in the block |
| `globaldict` | ∅ ⇒ dict | returns the **global** dictionary from the [dictionary stack][dictionary stack] |
| `gt`  | integer:a integer:b ⇒ integer:a&gt;b | compares two integers |
| `gte`  | integer:a integer:b ⇒ integer:a&gt;=b | compares two integers |
| `if` | boolean block ⇒ ∅ | executes the block if the boolean is true |
| `ifelse` | boolean block:if block:else ⇒ ∅ | depending on the boolean value, executes either the block:if or the block:else |
| `in` | array any:value ⇒ boolean | check if the value exists in the array |
|  | dict string:name ⇒ boolean | check if the name exists in the dictionary |
|  | block any:value ⇒ boolean | check if the value exists in the block |
| `index` | integer ⇒ any | get an item from the [operand stack][operand stack] based on its index (0-based) |
| `join` | array:ofStrings => string | join all strings of the array to form a single string |
| `length` | string ⇒ integer | returns the length of the string|
|  | array ⇒ integer | returns the number of values in the array |
|  | dict ⇒ integer | returns the number of values in the dictionary |
|  | block ⇒ integer | returns the number of values in the block |
| `loop`  | block ⇒ ∅ | executes the block repeatedely (must use `break` to stop the loop) |
| `lt`  | integer:a integer:b ⇒ integer:a&lt;b | compares two integers |
| `lte`  | integer:a integer:b ⇒ integer:a&lt;=b | compares two integers |
| `mark`  | ∅ ⇒ mark | mark |
| `neq` | any:1 any:0 ⇒ boolean | returns true if the two items are **not** [strictly equal][strict comparison] |
| `pop`  | any ⇒ ∅ | removes the top of the [operand stack][operand stack] |
| `roll`  | any:n-1 ... any:0 integer:n integer:j ⇒ any:(j-1)%n ... any:0 any:n-1 ... any:j%n | performs a circular shift of the objects anyn-1 through any0 on the [operand stack][operand stack] by the amount j. Positive j indicates upward motion on the stack, whereas negative j indicates downward motion.
| `set` | string integer:pos integer:code ⇒ string | update the character code at position pos _(0-based)_ in the string |
|  | array integer:pos any ⇒ array | updates the item at position pos _(0-based)_ in the array |
|  | dict string:name any ⇒ dict | updates the value associated to the name in the dictionary |
| `sub` | integer:1 integer:0 ⇒ integer | substracts two integer (integer:1 - integer:2) |
| `systemdict` | ∅ ⇒ dict | returns the **system** dictionary from the [dictionary stack][dictionary stack] |
| `throw` | dict => ∅ | throws a custom exception (based on dictionary `name` and `message`) |
|  | string => ∅ | throws a custom exception |
| `true` | ∅ ⇒ boolean | true |
| `type` | any ⇒ string | returns the type of the item on top of the [operand stack][operand stack] |

[dictionary stack]: https://github.com/progbots/engine/blob/main/docs/README.md
[operand stack]: https://github.com/progbots/engine/blob/main/docs/README.md
[strict comparison]: https://github.com/progbots/engine/blob/main/docs/README.md
