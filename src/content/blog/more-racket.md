---
layout: ../../layouts/Post.astro
title: "Learning Racket: Part 2"
pubDate: "2024-08-01"
description: "Finishing up the Racket Essentials chapter and a note on the future of the series."
author: "Sydney Newmark"
tags: ["racket", "exploration", "meta"]
featured: false
---

Wow! It's been a while. Over the past two months, I've been busy with side projects[^1], vacationing (Norway!), and preparing to go back to school in mid-August, but I'm back to dive a little deeper into Racket and see more of what the language has to offer.

# Contents

# The Latter Half of Racket Essentials

I'll pick up right where I left off, with the rest of the Racket Essentials chapter. It's list, iteration, and... recursion time? Oops. Seems like I might have gotten ahead of myself with [the end of part one](/p/first-steps-with-racket#completing-fizz-buzz). Anyways. There are many functions which _operate_ on lists, but before we can get to any of the fun stuff, we need to create a list! That's where `list` comes in.

```racket
(list "red" "orange" "yellow" "green")
```

`racket main.rkt`:

```racket
'("red" "orange" "yellow" "green")
```

Simple enough. And if I want to access `"yellow"` from this list, I can just use `list-ref` with the associated index.

```racket
(list-ref (list "red" "orange" "yellow" "green") 2)
```

The index here is `2` because lists are zero-indexed in Racket, ~~as they should be~~[^2]. Now, as an ardent [Rust](https://rust-lang.org) fan, where there are lists, I _must_ have `map`, `filter`, and their friends. Luckily for me, this is a functional language, and (at least some of) these are built right into the language! For instance, I can use `map` to add an exclamation point to the end of each color in my list above.

```racket
(map (lambda (color)
    (string-append color "!"))
    (list "red" "orange" "yellow" "green"))
```

Once again, I'm not particularly enthused by the syntax here, but it works.

`racket main.rkt`:

```racket
'("red!" "orange!" "yellow!" "green!")
```

Racket also has equivalents to the `all` and `any` iterator methods found in Rust with `andmap` and `ormap` representing each respectively. As an example,

```racket
(andmap boolean? (list #t #f))
```

correctly evaluates to `#t`. The rest of this section is more theoretical, so I won't get into it too much here. It continues by exploring how to build list iteration such as `map` and `length` from scratch using primitives such as `first` and `rest`. It also touches on [tail-call elimination](https://en.wikipedia.org/wiki/Tail_call) and the connections between iteration and recursion, particularly as they relate to Racket.

There's also an interesting relationship between lists and what Racket calls pairs, and I'd recommend reading the [Pairs, Lists, and Racket Syntax](https://docs.racket-lang.org/guide/Pairs__Lists__and_Racket_Syntax.html) section for a good introduction.

# Advent of Code: Racket Edition

Now that I've seen `map` and `filter`, two of my favorite Rust iterator methods for [Advent of Code](https://adventofcode.com), I knew I had to try solving a puzzle. I decided on [2022's day one problem](https://adventofcode.com/2022/day/1) mostly because there isn't much parsing I have to do. There is _some_, but it's easily handled with just a couple relevant list functions.

## Parsing the Input

For the sake of simplicity, I'll hardcode the input:

```racket
#lang racket

(define input "1000
2000
3000

4000

5000
6000

7000
8000
9000

10000")

input
```

When run with `racket`, this prints the following:

```racket
"1000\n2000\n3000\n\n4000\n\n5000\n6000\n\n7000\n8000\n9000\n\n10000"
```

A good start. Now, I need to figure out how to split this string by `\n\n`. Looking at [the section in the Racket reference for strings](https://docs.racket-lang.org/reference/strings.html), I notice `string-split`, which seems to do exactly what I want.

```diff
- (input)
+ (string-split input "\n\n")
```

```racket
'("1000\n2000\n3000" "4000" "5000\n6000" "7000\n8000\n9000" "10000")
```

Perfect! This is coming along nicely. Now that I have an outer list to work with, I need to create an inner list for each item of the outer list which contains the newline-separated numbers. Kind of a mouthful to write out, but this is a perfect candidate for `map`: I'll apply a function to each of the outer list items to create several new inner lists, taking advantage of `string-split` once more.

```racket
(map (lambda (item)
    (string-split item "\n")) (string-split input "\n\n"))
```

We keep the `(string-split input "\n\n")` from earlier, and pass that as the list argument to `map`. The `lambda` declares the **mapping function**, which takes each `item` of the outer list and splits that on `\n`, creating the inner list.

Now, our parsed input looks like this:

```racket
'(("1000" "2000" "3000") ("4000") ("5000" "6000") ("7000" "8000" "9000") ("10000"))
```

Much better! Now, what do I actually do with this?

## Part One

The [instructions for the problem](https://adventofcode.com/2022/day/1) tell us the following:

> This list represents the Calories of the food carried by five Elves:

> The first Elf is carrying food with 1000, 2000, and 3000 Calories, a total of 6000 Calories.

> The second Elf is carrying one food item with 4000 Calories.

> The third Elf is carrying food with 5000 and 6000 Calories, a total of 11000 Calories.

> The fourth Elf is carrying food with 7000, 8000, and 9000 Calories, a total of 24000 Calories.

> The fifth Elf is carrying one food item with 10000 Calories.

So, we need to convert each string in the inner list to a number, and then add those numbers together. Finally, we need to find the maximum item in the new outer list containing those sums. Seems easy enough. Let's start by adding an additional function to map each string in a list to a number, and then sum those numbers together. We could also modify our existing `map`, but creating a new one feels cleaner.

```racket
(define (sum lst)
  (apply + lst))

(define (convert-elf elf)
  (sum (map (lambda (item)
              (string->number item)
              ) elf)))
```

`sum` is a utility function which applies `+` to each element of `lst` to reduce `lst` to a single number. Meanwhile, `convert-elf` takes one of the inner lists in our outer list and maps each string to a number using `string->number`. Lastly, we call our shiny new `sum` function with the result of the `map` as its `lst` argument.

We can use this new function to simplify our original list:

```racket
(define converted-elves (map (lambda (elf) (convert-elf elf)) elves))
```

`converted-elves` looks like this:

```racket
'(6000 4000 11000 24000 10000)
```

Almost there! We just need some way to find the maximum of these elements. Racket doesn't provide one out of the box, so we'll have to create one ourselves. First, we need some function to find the maximum of just two items, which looks like the following:

```racket
(define (max-element x y) (if (> x y) x y))
```

This takes two numbers, `x` and `y`, and returns the correct number based on whether `x > y`. Second, we need some function to find the maximum of a whole list of items. Recursion is natural in Racket, so let's find our base case for a `max-list` function. This occurs when the second element of the list is null (i.e. we have a list of one element).

So far, this is what that looks like in Racket:

```racket
(define (max-list ls)
  (if (null? (rest ls))
      (first ls)
      ; --snip --
))
```

This should be pretty self-explanatory so far. If the `rest` of the list `ls` is null, then the maximum of the list is simply the `first` element. Otherwise, the maximum of the list is the maximum between the `first` element and the result of `max-list` on the rest of the list.

```racket
(define (max-list ls)
  (if (null? (rest ls))
      (first ls)
      (max-element (first ls) (max-list (rest ls)))))
```

And that completes our `max-list` function! Running `max-list` on our `converted-elves` gives me `24000`, which is the correct answer for the test data. Using the provided puzzle input for my account, I also get the correct answer[^3]. Onward!

## Part Two

The instructions for the second part tell us this:

> The Elves would instead like to know the total Calories carried by the top three Elves carrying the most Calories. That way, even if one of those Elves runs out of snacks, they still have two backups.

Seems easy enough. I have to:

1. Sort the list in descending order by Calories
2. Select the first three items in the list
3. Add them together

Fortunately, Racket does provide a `sort` function built in to the language, so step one is as easy as

```racket
(define sorted-elves (sort converted-elves >))
```

which gives us

```racket
'(24000 11000 10000 6000 4000)
```

We can then use the handy `take` function to select the first three items:

```racket
(take sorted-elves 3)
```

And then sum them together:

```racket
(sum (take sorted-elves) 3)
```

Voila! That prints `45000`, the correct answer for the problem.

Writing this all out makes me realize that I wasted _some_ effort figuring out `max-list`, but it was a good exercise in reviewing how to reason about these basic recursive functions, so I don't regret it.

All put together, the program looks like this:

```racket
#lang racket

(define input "[omitted]")

(define (sum lst)
  (apply + lst))

(define (max-element x y) (if (> x y) x y))

(define (max-list ls)
  (if (null? (rest ls))
      (first ls)
      (max-element (first ls) (max-list (rest ls)))))

(define (convert-elf elf)
  (sum (map (lambda (item)
              (string->number item)
              ) elf)))

(define elves (map (lambda (item)
                     (string-split item "\n")) (string-split input "\n\n")))

(define converted-elves (map (lambda (elf) (convert-elf elf)) elves))

(define sorted-elves (sort converted-elves >))

(max-list converted-elves) ; 24000
(sum (take sorted-elves 3)) ; 45000
```

# Conclusion

That was pretty fun! I always love completing Advent of Code puzzles, especially with languages I'm new to/aren't familiar with. `map` and friends are always really great to have, and definitely found good use here.

_I'm still not quite used to having so many parentheses._ **However**, rainbow brackets and formatting does still help quite a bit with legibility.

## The Future of The Series

I've had a lot of fun with the "actually building stuff" portions of these first two entries in the Learning Racket series, so in the future, as I learn more Racket and build interesting things with it for school, I might write deeper exploration posts into those things, like what I've done here with the Advent of Code section. With that said, this will be the last of the "working through the guide" posts[^4], and I probably won't be returning to Racket on this blog for quite a while.

Thanks for reading!

-- Sydney

[^1]: I've been building [a multiplayer Othello web app](https://github.com/cecelot/olly)
[^2]: Yes, there are benefits to one-based indexing in particular contexts
[^3]: My puzzle inputs are posted in [my GitHub repository for Advent of Code](https://github.com/cecelot/advent-of-code)
[^4]: This describes [the first quarter of this one](#the-latter-half-of-racket-essentials) and most of [the last one](/p/first-steps-with-racket)
