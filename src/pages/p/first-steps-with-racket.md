---
layout: ../../layouts/Post.astro
title: "A Headstart on Racket: Part 1"
pubDate: "2024-06-04"
description: "Introducing myself to Racket to be ahead when I start CS 1102 in the fall."
author: "Alaina Newmark"
tags: ["racket", "nix", "walkthrough"]
featured: false
---

Back when high school was still in session, I wanted to check out and learn the basics of [Racket](https://racket-lang.org) because [CS 1102](https://www.wpi.edu/academics/calendar-courses/course-descriptions/3776/computer-science#CS-1102), the accelerated intro computer science course at my university, uses it as its functional language of choice. After running into issues setting up the language server for Visual Studio Code, I shelved my interest, but now that it's summer, I decided to give it another try.

# Contents

# Installation

I quickly got to work installing Racket using my favorite [Nix](https://nixos.org) [flake](https://zero-to-nix.com/concepts/flakes) starter as a base:

```nix
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs @ {
    self,
    flake-parts,
    ...
  }:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = [
        "x86_64-darwin"
        "aarch64-darwin"
        "x86_64-linux"
        "aarch64-linux"
      ];
      perSystem = {
        system,
        pkgs,
        ...
      }: {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [];
        };
      };
    };
}
```

I'll start by adding the minimal toolchain (without other bells and whistles like [DrRacket](https://docs.racket-lang.org/drracket/)):

```diff
- buildInputs = with pkgs; [];
+ buildInputs = with pkgs; [
+    racket-minimal
+ ];
```

Now, it's time to open [Visual Studio Code](https://code.visualstudio.com), install the [Magic Racket](https://marketplace.visualstudio.com/items?itemName=evzen-wybitul.magic-racket) extension, and see if it works!

Usually, this is all I need to do. Not in this case, though.

```
standard-module-name-resolver: collection not found
for module path: (lib "racket-langserver")
collection: "racket-langserver"
in collection directories:
/Users/aly/.local/share/racket/8.12/collects
/nix/store/wlrqc11bqjra4r96kf2s4q4bp5dn4fcx-racket-minimal-8.12/share/racket/collects/
/nix/store/wlrqc11bqjra4r96kf2s4q4bp5dn4fcx-racket-minimal-8.12/share/racket/pkgs/base
/nix/store/wlrqc11bqjra4r96kf2s4q4bp5dn4fcx-racket-minimal-8.12/share/racket/pkgs/racket-lib
```

Seems Magic Racket can't find `racket-langserver`. What if I try installing it with Nix?

```zsh
nix search nixpkgs#racket-langserver
```

```
error: flake 'flake:nixpkgs' does not provide attribute 'packages.aarch64-darwin.racket-langserver', 'legacyPackages.aarch64-darwin.racket-langserver' or 'racket-langserver'
```

No luck, and I double checked with Nixpkgs' [online package search tool](https://search.nixos.org) to make sure it truly didn't exist. No problem -- I can use the first-party `raco` command-line tool instead.

```zsh
raco pkg install racket-langserver
```

After _almost eight minutes_, the command finished. I wonder if the extension is happy now...

```
ffi-lib: could not load foreign library
  path: libX11.6.dylib
  system error: dlopen(libX11.6.dylib, 0x0006): tried: [...]
```

Huh? It wants `libX11`, apparently. Very well, I'll add it to my `buildInputs`:

```diff
buildInputs = with pkgs; [
    racket-minimal
+   xorg.libX11
];
```

Reloading VSCode and... nope, same error message as before. At this point, I turned to the wider internet, and after some searching, I come across [this issue on Nixpkgs' repository](https://github.com/NixOS/nixpkgs/issues/209660) and [this issue comment](https://github.com/NixOS/nixpkgs/issues/209660#issuecomment-1761191971), which is the exact issue I'm facing!

This is the comment in question:

> I was having issues with racket language server on macOS crashing because it was unable to find X11 libraries. Replacing `--enable-xonx` with `--enable-prefix` fixed it.

Armed with this bit of knowledge, I decided to try patching it myself using [`overrideAttrs`](https://ryantm.github.io/nixpkgs/using/overrides/#sec-pkg-overrideAttrs):

```diff
(racket-minimal.overrideAttrs (finalAttrs: previousAttrs: {
    configureFlags = [
        "--enable-${previousAttrs.shared}"
        "--enable-lt=${pkgs.libtool}/bin/libtool"
+       "--enable-prefix"
    ];
}))
```

```
ERROR: --prefix not allowed for a Mac OS build, unless either
       >          --enable-xonx is supplied (to create a Unix-style
       >            build), or
       >          --enable-macprefix is supplied (to allow a Mac-style
       >            installation, even though --prefix is normally used
       >            for Unix-style installations)
```

Oh. Well, let's try that as a possible quick fix.

```diff
-       "--enable-prefix"
+       "--enable-macprefix"
```

and... after several minutes of building the [`direnv`](https://direnv.net) environment, it finally succeeded! Now time to see if my issue is fixed (after reinstalling `racket-langserver` because apparently it went poof when I built the patched Racket package)[^1].

Moment of truth?

... it works! Now for the fun part.

# Hello World

To start off, let's see if I can run a simple program I took from the "Creating Executables" section in Chapter 1 of their [official guide](<https://docs.racket-lang.org/guide/intro.html#(part._.Creating_.Executables)>).

_main.rkt:_

```racket
#lang racket

(define (extract str)
  (substring str 4 7))

(extract "the cat out of the bag")
```

```zsh
racket main.rkt
```

```
"cat"
```

Amazing. What about a "Hello, \<name\>!" program?

After some brief fiddling, I came up with this:

```racket
#lang racket

(define (hello-person name)
  (display "Hi, ") (display name) (display "!")
  )

(hello-person "Alaina")
```

This code is a bit awkward because I don't know how to concatanate strings in the case where those strings are variables, and I'd rather not spend too much time messing around with it right now. Running the code using the same `racket main.rkt` command from earlier produces the result I want, though.

```
Hi, Alaina!
```

Ok, now time for Chapter 2: Racket Essentials. This is where things _really_ pick up.

# Half of Racket Essentials

It starts out with some [simple values](https://docs.racket-lang.org/guide/Simple_Values.html). 

Racket has numbers:

```racket
42
```

and strings:

```racket
"Hello, world!"
```

Booleans are unusual, but only syntactically: `#t` for true and `#f` for false. In terms of how values are treated, anything that's not an `#f` behaves like `#t`. Delightfully simple!

Functions are where things get a bit more interesting. The arguments are separated by spaces, and parentheses **wrap** the entire call, rather than surrounding only the arguments, which has been the case in the languages I've learned up until this point. Like so:

```racket
(substring "the girl dancing in the forest" 4 8)
```

```racket
"girl"
```

Now, if I want to _define_ my own functions, I can use the aptly-named `define` keyword as I did earlier in my [hello-person](#hello-world) example.

## Improving Hello World

Moving on from simple values to the section on [simple definitions and expressions](https://docs.racket-lang.org/guide/syntax-overview.html), I see this snippet:

```racket
(define (bake flavor)
  (printf "preheating oven...\n")
  (string-append flavor " pie"))
```

Very interesting! `string-append` seems quite useful. Let's see if I can take advantage of it to make `hello-person` more concise:

_main.rkt:_

```racket
#lang racket

(define (hello-person name)
  (string-append "Hello, " name "!")
  )

(hello-person "Alaina")
```

I'm able to replace my three separate calls to `display` from earlier with a single `string-append` call! Verifying it produces the output I'm expecting:

```
racket main.rkt
```

```racket
"Hello, Alaina!"
```

Awesome. Now, how about adding on some conditional logic?

## Conditionals

The format for the simplest conditional, `if`, goes like this:

```
(if <expr> <expr> <expr>)
```

The first `<expr>` is the condition, so it's always evaluated. If this condition evalutes to anything other than `#f`, then the second `<expr>` is evaluated as the "happy path" of the expression. Otherwise, the third `<expr>` is evaluated. Operator syntax is typical for a lisp, with the relevant symbol coming before its parameters like so:

```racket
(if (> 1 2)
    "1 > 2"
    "1 < 2")
```

This prints `"1 < 2"`, as I'd expect it to. Neat!

These `if` expressions can be nested, too, though I imagine that would get pretty cumbersome. For instance, what if I [wanted to print](https://en.wikipedia.org/wiki/Fizz_buzz#Programming) `Fizz` if a number is divisible by `3`, `Buzz` if a number is divisible by `5`, `FizzBuzz` if it's divisible by both, and the number itself if it's none of the above? That's four separate cases!

### Fizz Buzz for a Single Number

For these extended conditionals, Racket provides this helpful alternative called the `cond` form:

```racket
(define (fb-single n)
  (cond
    [(equal? (modulo n 3) 0)
     "Fizz"]
    [(equal? (modulo n 5) 0)
     "Buzz"]
    [(and (equal? (modulo n 3) 0) (equal? (modulo n 5) 0))
     "FizzBuzz"]
     [else (number->string n)]
    )
  )

(fb-single 3)
(fb-single 9)
(fb-single 5)
(fb-single 25)
(fb-single 15)
```

Here, we have three branches enclosed with `[`, whose first parameter is the condition, and the second is the expression to return. To illustrate this, in the code snippet above, the condition for the first branch is `(equal? (modulo n 3) 0)`, and `"Fizz"` is the expression to return. Note that we also have an `else` block: this functions as a fallback, like the `default` branch of a `switch` statement or the `_` branch of a [`match` expression](https://doc.rust-lang.org/std/keyword.match.html) in Rust. In this case, I print the number, to meet FizzBuzz's requirements.

```racket
"Fizz"
"Fizz"
"Buzz"
"Buzz"
"Fizz"
```

That all looks correct, except for the last entry. It's an easy fix, though. Since `cond` exits at the first true condition, we can simply move the `and` branch above the other two.

```racket
(cond
    [(and (equal? (modulo n 3) 0) (equal? (modulo n 5) 0))
        "FizzBuzz"]
    [(equal? (modulo n 3) 0)
     "Fizz"]
    [(equal? (modulo n 5) 0)
     "Buzz"]
     [else (number->string n)]
    )
```

```racket
"Fizz"
"Fizz"
"Buzz"
"Buzz"
"FizzBuzz"
```

There we go. We can do a little better than this, though. `(equal? (modulo n d) 0)` is a repeated pattern here that we can refactor out:

```racket
(define (div-by? n d)
  (equal? (modulo n d) 0)
  )
```

Now, our `fb-single` looks like this:

```racket
(define (fb-single n)
  (cond
    [(and (div-by? n 3) (div-by? n 5))
     "FizzBuzz"]
    [(div-by? n 3)
     "Fizz"]
    [(div-by? n 5)
     "Buzz"]
     [else (number->string n)]
    )
  )
```

Much nicer, but `div-by?` isn't actually used outside of `fb-single`. I don't want to pollute the top-level scope! What if I simply move it inside of `fb-single`?

```racket
(define (fb-single n)
  (define (div-by? n d)
    (equal? (modulo n d) 0)
    )
    ; -- snip --
)
```

As it turns out, this works perfectly! It's the first method for **local binding**, with the other two options being the `let` and `let*` forms.

## Local Binding (aka, variables)

Beginning with the `let` form, I'm reminded of Nix's own `let ... in` expression behavior. Racket's guide provides this tic-tac-toe example:

```racket
(let ([x (random 4)]
        [o (random 4)])
    (cond
      [(> x o) "X wins"]
      [(> o x) "O wins"]
      [else "cat's game"]))
```

The first section here declares the bindings in the block, `x` and `o`, and initializes them to the result of `(random 4)`. Then, we have a `cond` block which prints the outcome of the game depending on the player scores.

There's also the similar `let*` form, which allows the "declaration section" to use variables previously defined, a lot like `let rec`'s behavior in Nix. For example:

```racket
(let* ([x (random 4)]
        [o (random 4)]
        [diff (number->string (abs (- x o)))])
    ; -- snip --
    )
```

Here, we're defining `diff` to be the absolute difference between `x` and `o`. We can't do that in a normal `let` block. Pretty convenient!

# Completing Fizz Buzz

With these basics out of the way, I wanted to finish my FizzBuzz example from earlier by looping from `1` to `n`. Since this is a functional language, that means recursion! Here goes:

```racket
(define (fb n end)
  (let ([remaining (- end n)])
    (display (string-append (fb-single n) "\n"))
    (cond [(>= remaining 1) (fb (+ n 1) end)])
    )
  )
```

First, I declare a function `fb` which takes in `n`, which is the current number, and `end`, which is, well, the ending number. I use the handy `let` block to define `remaining`, the amount of iterations still to go through. In the main function body, I print out the current number, then use the `cond` conditional form for checking the base case: `remaining == 0`. If the base case is false, then I increment `n` by one and pass in `end` along with it. Since there isn't any logic that runs when the condition is false, `if` wouldn't be a good choice here because an `else` expr is required:

> The first `‹expr›` is always evaluated. If it produces a non-`#f` value, then the second `‹expr›` is evaluated for the result of the whole `if` expression, otherwise the third `‹expr›` is evaluated for the result.

Now, I call this using `(fb 1 100)`, which _should_ print the correct FizzBuzz sequence from `[1, 100]`.

Let's see how I did. Using the [first text file of the output I saw on GitHub](https://github.com/shlomif/fizz-buzz/blob/master/fizz-buzz.txt) and after deleting a stray newline, [comparing using an online tool shows no discrepency](https://www.diffchecker.com/8F8cZwlm/) in my output.

Phew!

# Conclusion

This was really fun to work through, and it was fascinating to see how closely `let` and `let*` mapped to Nix constructs I already knew. Additionally, I was pleasantly surprised at how versatile `cond` is.

I'm already not that enthusiastic about the sheer number of parentheses I have to write, and it makes some of the logic a bit hard to reason through, especially with multiple layers of nesting. This was mostly alleviated by Magic Racket, which made things more legible with its format-on-save functionality to provide what I'll call _semantic spacing_.

While I had a bit of trouble setting up the language server used by Magic Racket initially, it ended up being a pretty straightforward fix and didn't take me too long to figure out.

This was a lot, and I've barely scratched the surface! In Part 2 of this series, I plan to pick back up with the latter half of the Racket Essentials chapter and then start on the third one: Built-In Datatypes.

-- Alaina

[^1]: My assumption is the package directory must be different with the "Mac-style" installation
