# Let's talk about recursivity

A typical example of recursive function is the [factorial function](https://en.wikipedia.org/wiki/Factorial), having :

* `fac(n) = n * fac(n-1)` 
* `fac(1) = 1`

The following code sample is an example implementation using the engine. Documentation for operators is available [🚧 here](https://progbots.github.io/engine/operators/).

```text
"fac" {
  dup 0 lte
  {
    pop 1
  }
  {
    dup 1 sub fac mul
  }
  ifelse
} def
```

> Factorial function recursive implementation

Before the evaluation of the `def` call, the operand stack contains two values (from bottom to top) :
* the *string* `"fac"`
* a *block* containing the body of the function. 

The block itself is composed of the following values :

* The *call* to `dup`
* The *integer* `0`
* The *call* to `lte`
* A block with :
  * The *call* to `pop`
  * The *integer* `1`
* A block with :
  * The *call* to `dup`
  * The *integer* `1`
  * The *call* to `sub`
  * The *call* to `fac`
  * The *call* to `mul`
* The *call* to `ifelse`
  
When the `def` call is evaluated, two things happens :
* the *block* is converted to an executable block, known as a *proc* (but the content does not change)
* the name `"fac"` is mapped to the *proc* at the top of the dictionary stack.




the *block* becomes a *proc*: an executable block,

When this function is evaluated, its content is mostly composed of calls.
For instance : `dup 1 sub fac mul` is actually composed of :
* a *call* to `dup`
* the *integer* `1`
* the *call* `sub`
* the *call* `fac`
* the *call* `mul`

When executing, each call is evaluated through the dictionary stack that associate a name to a value, whatever its content.
One of the first dictionary in this stack is the system one (`systemdict`) which enumerates all known operators (like the most basic instructions existing)

`dup`, `sub` and `mul` and resolved to their corresponding operators.

This behavior is interesting for multiple reasons :
* it provides a readable name for operators
* the association being done at evaluation time, it can be changed by interfering with the dictionary stack (for instance, you may have stricter / debug version of this operators).
But it comes with a cost : the resolution is done on every call.

Regarding `fac`, the `def` will associate the name to a proc in the current dictionary (`currentdict`) which is a global dictionary (`globaldict`)

The `bind` operator does this resolution based on the dictionary stack.

```text
"fac" {
  dup 0 lte
  {
    pop 1
  }
  {
    dup 1 sub fac mul
  }
  ifelse
} bind def
```

Will bind everything *but* the `fac` call because it does not exist YET in the dictionary stack.
Such a method would work in the engine, no problem.






Obviously, like in any language, there are ways to get rid of the recursivity.

The operand stack being global, you don't need variables and additional storage.
Hence, the fac function could be written as :

```text
"fac" {
  1 exch
  {
    dup 0 lte { pop break } if
    dup 3 1 roll mul exch 1 sub
  }
  loop
} def
```

(and this is way faster) => compare cycles