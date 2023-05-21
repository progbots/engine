# Introduction

## Initial concept

Before getting into the details of the engine itself, it might be interesting to understand where the idea came from. In the early 2000, I was working as a software engineer in a document automation company. Their solution is able to process documents from different inputs (emails, faxes, FTP...) and formats (text, tif, PDF...).

In particular, PDF and Postscript were two formats that I had to deal with. Surprisingly, both are somewhat related.

At that time, I was coding mostly with C, C++ and .NET. I was also playing a lot with JavaScript, XML and XSL but I was completely new to PostScript. I didn't even know it was a programming language.

Here is an online example of what PostScript / PDF document looks like :  https://www.ivank.net/veci/pdfi/

After learning the language basics and looked into existing code, I realized how powerfull the syntax was as it was offering some interesting technics that were new to me.
For instance, almost any operator could be overloaded which, by extension, allowed us to "capture" the text that were displayed in the documents. Also, the PDF parsing was based on the Postscript engine.

This language forced me to think out of the box while finding ways to hook the processing of documents in order to maximize the rendering on a page.

I really enjoyed working with this language even if, in the end, that was my only experience with it.

20 years later, I have some specific needs that require to creaet a custom parser. I thought it might be a good idea to reproduce the Postscript engine concepts, with some modifications (for instance, exception handling or making the engine interruptible).

## A simple engine

The state of the engine contains three stacks :
* The operand stack : it contains the operands for all the functions to be executed
* The dictionary stack : it provides context for evaluation of the calls
* The call stack : unlike the two other stacks that are manipulated by the program, the call stack is automatically filled to 

Simple type system
* boolean *(booleantype)* : `true` and `false`
* integer *(integertype)* : numbers like `1`, `0`, `-1`...
* string *(stringtype)* : any string, like `"Hello World !"`
* call *(calltype)* : almost anything else is considered a call, like `[`, `eq`, ...

Some other types exist but they are not directly 'exposed' :
* operator *(operatortype)* : an operator is an implementation of a call (`eq`)
* mark *(marktype)* : a marker on the operand stack that relates to some specific operators (`cleartomark`, `counttomark`, `]`...)
* array *(arraytype)* : an array of values
* dict *(dicttype)* : a dictionary that associates a string key to a value of any type
* block *(blocktype)* : a block of code (surrounded by `{` and `}`)
* proc *(proctype)* : an executable block of code

When a call is made, the corresponding implementation is searched through the dictionary stack, the first matching result is evaluated. If no value is found, the `Undefined` error is thrown.

In order to do any operation, you must first stack the operands and then call the operator as in the [Reverse Polish notation](https://en.wikipedia.org/wiki/Reverse_Polish_notation) :
```postscript
1 2 add
```
Would consumes the operand stack to return 3

(screenshot)

## A not so simple implementation

In less than one week, I was able to implement basic calls (`1 2 add`). Yet, making the engine interruptible and adding memory management and making it debuggable was quite more complex.

In the end, I decided to go with JavaScript Generators.
Hence, when you do `state.parse('1 2 add')`, the result is not `3`. Instead you get back an iterator 
