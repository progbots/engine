# Let's talk about recursivity

Considering the factorial function, here is the implementation with the engine :

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

