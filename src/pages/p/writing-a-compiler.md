---
layout: ../../layouts/Post.astro
title: "A Foray Into Compiler Design"
pubDate: "2024-05-31"
description: "A story of my introduction to compilers and subsequent journey in writing my very own compiler from scratch."
author: "Sydney Newmark"
tags: ["compilers", "reflections"]
featured: true
---

**Eight months** of hard work and dedication on the **same project**! How crazy is that? As someone who can _never_ manage to finish her projects, this was quite the accomplishment for me.

Last week, I gave a presentation[^1] at the University of Texas at Austin's [Oden Institute](https://oden.utexas.edu), where I showcased the things I learned in the second semester[^2] of my senior year of high school and some of my reflections in the process of wristing a compiler from scratch for my Independent Study[^3] in computer science.

Now that I've finished the course, I figured I would take some time here to reflect more fully, by retracing and sharing my entire journey of how I got to this point today, including how I got into compiler design, the resources I used throughout this past year, the outcomes of my project, and the challenges I encountered along the way.

# Contents

# Origins

It's hard to quite pin down when my journey started, because I've been interested in compilers for at least a few years now. Initially, I turned to Google, as I always did back then[^4].

I was doing some cursory searching to see if I could write a programming language of my own, and suffice it to say that 16-year-old Sydney had no idea what she was getting into. After looking around for a little while, I came across a few blog posts I no longer remember, which introduced me to the core ideas of lexical analysis, parsing, and abstract syntax trees (the practical ideas, discounting all the theory). After reading these posts, I felt prepared to write one myself, so I tried. I spent a couple days trying to write a simple lexical analyzer in C++, with the intention of transforming it into a full interpreter, but quickly realized I was in well over my head. While I vaguely understood what lexical analysis and parsing meant from reading those articles, I stil was clueless as to how I would implement them in a way that was both functional **and** not incredibly cumbersome to write and maintain.

It wasn't until several months later that I discovered the free [Crafting Interpreters](https://craftinginterpreters.com) book[^5] by Robert Nystrom. I cannot overstate how useful this book was in my compiler journey. If you're looking to get started in writing an interpreter or compiler of your own, I would highly recommend it. It taught me enough to create several small projects, which all ended up half-finished, in typical Sydney fashion.

## Getting Serious

Rewinding a few months, it's spring of 2023, and I'm thinking about courses for my senior year of high school. In particular, I was trying to decide on a proposal for my Independent Study project in computer science. After some deliberation, I came to the realization that this would be the perfect opportunity to formalize my exploration in compiler design, make it official, and actually build something that wouldn't be so half-finished[^6].

## A Proposal

Once I had decided to do my study in compiler design, I had to write my project proposal. It seemed straightforward -- a compiler has a series of logical steps a programmer must take in order to build a working product, and each step depends on the previous step.

At this point, my knowledge of those steps for a compiler was the following:

1. Lexical analysis
2. Parsing and building an abstract syntax tree
3. ???
4. Profit (have a working compiler!)

What's up with step 3? At this point, I knew the basics of "front-end" compiler development, and how to write a tree-walk and bytecode interpreter, from _Crafting Interpreters_, but I didn't really know how to convert that knowledge I had of interpeters to an actual honest-to-goodness compiler to transform directly to machine code, all on my own with minimal external libraries.

Which, to be clear, is what I wanted to do, though I didn't know it then. To illustrate this point, while I was working on my compiler project for school at the beginning of the fall semester, I dabbled a bit on the side with using LLVM on a _different_ compiler I had been writing in Rust, but it didn't quite satisfy my compiler design itch. I wanted to dismantle the black box as much as I could -- and that meant developing a back-end too, complete with block and trace generation and register allocation.

So I went and wrote my proposal, choosing _Modern Compiler Implementation in Java_ by Andrew W. Appel and Jens Palsberg as my primary reference textbook[^7], based on recommendations I'd gleaned from the internet and friends online.

## A Dilemma

As I alluded to before, I started writing a little compiler project around September concurrently with the one I was writing for school, which I named [Kyanite](https://en.wikipedia.org/wiki/Kyanite). I began by applying my knowledge from _Crafting Interpreters_ to write a lexical analyzer and recursive descent parser for the language. After that, I got a bit lost and ended up at a crossroads. Do I use LLVM or try to develop my own compiler backend? I hadn't yet read the chapters past lexical analysis and parsing in the Modern Compiler Implementation book, so I ended up using LLVM's C API via [inkwell](https://github.com/TheDan64/inkwell), a [safe](https://doc.rust-lang.org/nomicon/meet-safe-and-unsafe.html) [Rust](https://rust-lang.org) wrapper for the library.

_I chose Rust because [Ferris](https://rustacean.net) is the cutest programming language mascot. Just kidding-- I stand by my statement about Ferris though._

This was fun to do, and eventually, I had a functioning "Hello, world!" program! I was incredibly excited.

```kt
fun main() {
    println_str("Hello, world!");
}
```

This was not very easy -- especially for someone who had never done anything like this before at the level of abstraction I was using -- so it was also quite frustrating to get working. The two main culprits for this frustration were

1. not understanding LLVM's API that well, and
2. inkwell not making it obvious how to access particular interfaces.

After all this work, I still felt that LLVM was doing "too much." If I wanted to _really_ understand how a compiler can translate the program linked above into machine code, I would need to implement it on my own, a concept mildly foreign to me as someone who had written many small projects using the Node ecosystem where [everything](https://www.npmjs.com/package/left-pad) [under](https://www.npmjs.com/package/is-odd) [the](https://www.npmjs.com/package/is-even) [sun](https://www.npmjs.com/package/upper-case) [has](https://www.npmjs.com/package/is-number) [its](https://www.npmjs.com/package/split-string) [own](https://www.npmjs.com/package/array-includes) [package](https://www.npmjs.com/package/is-boolean-object).

By now, the fall semester was well underway, and I had these two projects I was working on at the same time that wanted to be the same thing, and eventually this side project in Rust limited how much time I could spend on the "official" version for my class.

## Goodbye Kotlin

The other major issue was that after a couple months of writing my compiler for school (which I was using Kotlin for because my textbook used Java and I wanted something a little nicer to use than Java), the project ended up at a really messy point for a multitude of reasons. Namely, the two primary issues were that

1. I wasn't used to writing Kotlin, and
2. using [JavaCC](https://javacc.github.io/javacc/) for lexing and parsing made the whole codebase more complex for my case compared to simply writing it by hand (which I had already done with my Rust compiler).

Here, I realized that it would be both more ergonomic for me as a developer and promote quicker development if I shifted all efforts over to the Rust compiler and discontinued work on the Kotlin one. As an extra bonus, writing a lexical analyzer and parser on my own gave me a lot of freedom to create really nice error messages. I had way too much fun with that.

# Learning The Basics of Backend Compiler Design

Switching my efforts to the Rust compiler probably happened at the most opportune time possible because it was at the point where I had just finished writing a type-checker and was preparing to enter the unexplored waters of backend compiler development. There are many ways to break this up, but the Modern Compiler Implementation book chose to break it down into the following sections, after type checking (which it calls Semantic Analysis):

1. Activation Records
2. Translation to Intermediate Code
3. Basic Blocks and Traces
4. Instruction Selection
5. Liveness Analysis
6. Register Allocation

I didn't really know what each of these meant when I started, which made for some frustrating moments where I didn't really understand why something was being done at a particular time.

For example, activation records (implemented in Kyanite [here](https://github.com/cecelot/kyanite/blob/a96b7ae330a6e0bd9e1edecfb07d540e1b7d83e2/crates/kyac/src/backend/kyir/arch/armv8a/mod.rs)) are first because the assembly I would be writing later centers around functions. In particular, they center around [frames](https://en.wikipedia.org/wiki/Call_stack#STACK-FRAME), which are responsible for managing all state in a program, even if that state is only stored in registers. Without getting too deep into the weeds, what I'll call the "activation record abstraction" is responsible for allocating data and ensuring registers' data remains stable across function calls. Here's a snippet of the interface:

```rust
pub trait Frame<I: ArchInstr> {
    fn allocate(&mut self, ident: &str, ptr: bool) -> Expr;
    fn get(&self, ident: &str) -> Expr;
    fn prologue(&self) -> Vec<I>;
    fn epilogue(&self) -> Vec<I>;
}
```

Data allocation will be done _a lot_ in the translation to intermediate code, the next step in the process. This is where `allocate` and `get` come in, which should be pretty self-explanatory from looking at the code.

Consider a variable such as `foo`, defined by the statement

```ts
let foo: int = 5;
```

in Kyanite. During the compilation process, I need some place to specify and keep track of where `foo` will go when I end up producing assembly instructions. The translator will call the current function frame's `allocate` method to store its location. To make it simple, all variables are stored on the stack, so `foo` might exist at offset `+8` from the [frame pointer](https://en.wikipedia.org/wiki/Call_stack#FRAME-POINTER). Then, whenever `foo` is referenced, the translator will call `get` to retrieve an expression accessing that location.

The other important detail the activation record abstraction is responsible for is ensuring that registers' data remains stable. Since computers only have a finite amount of registers, multiple functions are going to end up wanting to use the same ones! On both ARM64 and x86_64, registers are divided into two categories: caller-save and callee-save. My compiler doesn't have to deal with caller-save registers, so I'll only be discussing callee-save registers here. These are the registers which are going to be used by a **calling function** after the function it calls returns. Here's a short example:

```kt
// `foo` is the calling function (the caller)
fun foo() {
    bar(); // `bar` is the function being called (the callee)

    /* nothing happens here, so we don't need to callee-save
    any registers before we call `bar` above */
}

fun bar() {}
```

So, in addition to variables, I also store callee-save registers in the frame during the function's prologue, and restore them to registers during the epilogue (the prologue and epilogue are simply the glue code which sets up and cleans up functions' stack frames, etc.).

Not knowing I needed to callee-save registers was something that I spent more time than I'd like to admit debugging as my registers' data kept turning into garbage values after calling functions for no apparent reason.

# Challenges

This brings me to my first major challenge of the project: not knowing assembly (and operating system conventions) well enough.

## Not Knowing Assembly Well Enough

I figured it had to be pretty straightforward and simple. I would figure out which ARM assembly mnemonic corresponded to each machine-agnostic instruction from the intermediate representation and simply emit machine-specific instructions using those mnemoincs and the correct syntax.

Of course, it was not so simple.

One of the first issues I ran into was simply not knowing how to create a proper entrypoint to a program written in assembly. Depending on the operating system and other factors, the linker might expect there to be some label called `_main` in the source assembly, as in the case for ARM:

```asm
.section __TEXT,__text,regular,pure_instructions
    .global _main ; this is what the linker needs to see
    .p2align 2
_main:
    stp x29, x30, [sp, #-16]!
    mov x0, sp
    bl _set_stack_base
    bl main ; the actual main function defined using `fun main() { /* */ }`
    ldp x29, x30, [sp], #16
    ret
```

This was pretty simple to fix by compiling a "Hello world" program in C on my computer and seeing what the output was, a recurring theme throughout my journey -- figuring out how things were done by established tooling (clang, gcc, etc.) and taking inspiration from the assembly they were generating.

[Compiler Explorer](https://godbolt.org), an online compiler which beautifully maps C code to the corresponding instructions in the generated assembly, was invaluable throughout this process.

## Writing a Garbage Collector

The second major issue I encountered was during my process of writing the [garbage collection](<https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)>) algorithm to clean up heap-allocated objects, which was mostly an issue of code quality more than anything else. There were some highly specific issues due to misuse of [bumpalo](https://docs.rs/bumpalo/latest/bumpalo/), the library I was using for my [allocation system](https://os.phil-opp.com/allocator-designs/#bump-allocator), but most of my issues came down to

1. not commenting enough (if at all), and
2. not using descriptive variable names.

These issues ended up coming to light because of the sheer magnitude of things I needed to keep track of for [copying garbage collection](https://en.wikipedia.org/wiki/Cheney%27s_algorithm), as well as the amount of pointer arithmetic I was performing on these pointers to heap space, which made things incredibly difficult to reason through. I was mixing up from-space and to-space pointers, performing arithmetic on the wrong pointer, saving the wrong pointer for a particular state, or a multitude of other things. Eventually, when I had to go back and re-read my garbage collector to implement method descriptors, which makes [dynamic dispatch](https://en.wikipedia.org/wiki/Dynamic_dispatch) possible, I added comments to my algorithm and switched to more descriptive variable names, which helped me read my own code better. I hadn't commented often on my previous projects, because they were much smaller codebases. I always thought commenting those codebasese was a waste of time, so I just _never_ ended up doing it, creating bad habits that I carried with me into this compiler project. I'll definitely be commenting more from now on.

## Debugging

The third and final obstacle I encountered -- which was probably also the most annoying to deal with -- was effective debugging. If I thought debugging C++ segmentation faults was painful, debugging assembly segmentation faults was by far more of a headache. I started out by printing out values of registers by _literally calling_ `_println_int` with the register in question as the argument to the print function. This was incredibly tedious **and** time-consuming, but I did it anyway. Why I didn't decide to switch over to [LLDB](<https://en.wikipedia.org/wiki/LLDB_(debugger)>)'s command-line interface sooner than I did, I have no idea, because using a proper debugger, even just to catch which instruction was causing the segmentation fault and without using any other features, proved to be incredibly useful and saved hours of time.

It helped substantially that the errors I was making in the generation of the assembly almost inevitably led to a segmentation fault error. If I accidentally overwrote a register as zero, and then tried to use that register to index into an object in memory or a function's frame, my program would be trying to access memory stored at address `0+[some offset]`, which I imagine is always a protected memory region.

# Conclusion

By the time I had a functioning garbage collector, assembly that was being fairly consistently correctly generated, and proper debugging technique and code practices, I had developed a pretty solid final product. Overcoming these challenges opened doors for me to implement [inheritance](<https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)>), [polymorphism](<https://en.wikipedia.org/wiki/Polymorphism_(computer_science)>), and [parametric polymorphism](https://en.wikipedia.org/wiki/Parametric_polymorphism) (also known as generics), and most of these, having completed much of the tedious foundational work, were relatively easy to add to my compiler, with varying degrees of robustness.

There are several things I'm definitely going to take away from this experience:

1. **Use familiar languages and tooling**: Kotlin ended up being troublesome and I had to switch to Rust to maintain appropriate pacing for progress.
2. **Learn the basics before diving into an implementation**: This is something I hear all the time, but didn't take to heart before trying to learn assembly and operating system conventions while also trying to writing a compiler involving those things. I lost _a lot_ of time here.
3. **Look at what other people/things are doing and understand why**: Checking out what GCC/clang were producing helped me understand better how compilers handle storing and moving around constant strings and what prologues and epilogues look like, among many other things.
4. **Learn and use a proper debugger**: It saves so much time! LLDB helped me catch exactly where problems were occuring and pointed me towards solving them much more efficiently than "console debugging" did.
5. **Follow code conventions**: Comment code often and use descriptive variable names. I'll thank my past self, and others will thank me, for doing so.

In general, I'm pretty happy with where I ended up with this foray into compiler design after eight months, and I learned a lot from the experience. In the future, I'm looking forward to taking more formal compiler design courses, particularly on theory and optimizations, things I didn't cover as extensively in my practical-focused study.

For the curious looking to take a peek at the code and/or run the compiler themselves, the GitHub repository is [here](https://github.com/cecelot/kyanite).

I also have some preliminary (incomplete) documentation about it up [here](https://kyanite.alainacn.dev), which I plan to update some point this summer with everything I had done since my last edit to the docs.

-- Sydney

[^1]: Anyone interested can check out that presentation [here (.pdf)](https://files.alainacn.dev/writing-a-compiler/final-presentation.pdf) ([.key](https://files.alainacn.dev/writing-a-compiler/final-presentation.key))
[^2]: I went over the content I learned in the first semester at school and reflections on that experience in [this presentation (.pdf)](https://files.alainacn.dev/writing-a-compiler/midyear-presentation.pdf) ([.key](https://files.alainacn.dev/writing-a-compiler/midyear-presentation.key))
[^3]: Independent Study is a class offered to students passionate about computer science at my high school who have completed the sequence through our data structures and algorithms course
[^4]: I still do, but I have a much greater appreciation for books now
[^5]: This was the first proper book I had read in my computer science journey, which I consider its own milestone worth noting
[^6]: Yes, it is still half-finished -- somehow this feels different though
[^7]: Once the first semester of senior year started, I also borrowed the [dragon book](https://suif.stanford.edu/dragonbook/) from my computer science teacher, but didn't end up using it much
