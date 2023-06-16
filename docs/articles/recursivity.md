# Let's talk about recursivity

The following code sample is the implementation of the [factorial function](https://en.wikipedia.org/wiki/Factorial) with the engine :

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

> Factorial function

Before the evaluation of `def`, in the operand stack, these two items are present (from bottom to top) :
* the *string* `"fac"`
* a *block* containing the body of the function. 



When `def` is called, the *block* becomes a *proc*: an executable block,

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
