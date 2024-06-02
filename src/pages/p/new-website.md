---
layout: ../../layouts/Post.astro
title: "All About My Millionth Website Rewrite"
pubDate: "2024-06-02"
description: "From early iterations to today's version: a retrospective on the development of my website, discussing the techologies and tools I've experimented with to effectively publish and share my writing."
author: "Alaina Newmark"
tags: ["astro", "tailwindcss", "meta", "reflections"]
featured: false
---

The 2024 developer landscape for frontend technologies and frameworks is staggering.

We have, of course, the big three: [React](https://react.dev), [Vue](https://vuejs.org), and [Angular](https://angular.dev), but also some newer names, like [Svelte](https://svelte.dev) and [Solid](https://solidjs.com). Then, on one side of a spectrum, we have meta frameworks like [Next](https://nextjs.org) and [Nuxt](https://nuxt.com), and on the other side, static site generators like [Hugo](https://gohugo.io) and [Eleventy](https://11ty.dev). Interestingly enough, in the space in-between there's a mix of the two in [Astro](https://astro.build), which [hit version 1.0 in late 2022](https://astro.build/blog/astro-1/). With all of these options, choosing the right one for the project -- and developer(s) -- is its own challenge, and with my latest rewrite of this website, I think I've finally made a good choice.

# Contents

# Choosing a JavaScript Framework

I had the idea to write a personal blog/portfolio a bit under four years ago, and wrote my first iteration with [Next.js 10](https://nextjs.org/blog/next-10). Something so heavyweight definitely felt like overkill for a simple blog, and my first few iterations were **all** _very_ much over the top in comparison to what I really needed. I introduced a [CMS](https://en.wikipedia.org/wiki/Content_management_system), live previews with Next.js' now-outdated[^1] [Preview Mode](https://nextjs.org/docs/pages/building-your-application/configuring/preview-mode), and a comments system.

In adding all of this extra complexity, I got distracted from actually _writing_ blog posts, and so I never actually did. With no content to publish to my corner of the internet, I eventually deleted it.

And that was just my first iteration.

My second and third major iterations used Nuxt and Svelte, respectively, and suffered from the same problems as the first one. Too much complexity and subsequently, nothing to publish. They met the same fate, too.

Fast-forward to 2023, where I'm focused simply on writing and publishing, and _not_ developing overcomplicated websites. It was here where I decided to strip all of the heavy JavaScript frameworks away and go _almost_ as simple as I could using Jekyll, hosted directly on [GitHub Pages](https://pages.github.com), a far cry from my [Vercel](https://vercel.com)-hosted Next.js site from a couple years before. That lasted for a little while, until late that year, when I decided to go back to my roots and try out Next.js' relatively new [app router](https://nextjs.org/docs/app) introduced with [v13](https://nextjs.org/blog/next-13). I kept that version published until early 2024, when I concluded, once again, hat Next provided too much functionality that I wasn't using and switched to a Hugo site (using the [paper](https://github.com/nanxiaobei/hugo-paper) theme), with the idea that it would force me to focus on writing without getting distracted by fancy bells and whistles.

I left the site alone for several months until school was out and I could actually dedicate time to writing, which was when I determined that using Hugo's theme didn't satisfy my desires in terms of look and feel of the site. I could have kept using Hugo and written my own theme from scratch, but I wasn't interested in using Go's templating libraries.

So back to JavaScript I went. I knew I didn't want to use Next.js again, and I had heard of Astro, so I decided to try it out, with just a few requirements in mind:

1. Easy to learn/use
2. Content-focused
3. Customizable

As it turns out, Astro checks all of these boxes for me.

## Learning Astro

Over the past couple days, I wrote this site, following their [blog tutorial](https://docs.astro.build/en/tutorial/0-introduction/), which coincided perfectly with what my intent was with `alainacn.dev`. Most of the code running this site is a product of that and small additions, like [reading time](https://docs.astro.build/en/recipes/reading-time/) and a [404 page](https://docs.astro.build/en/basics/astro-pages/#custom-404-error-page).

In the process of following the tutorial, I was happy to realize that all of the markdown processing I was used to implementing manually with Next.js was done for me with Astro: no more messing with `remark` or `rehype` since I'm already provided with sane defaults! Aside from adding a plugin for reading time, all I had to do was add a plugin for generating a table of contents to a config array! Truly joyful, and exactly the simplicity I was looking for.

Horray for frameworks that do exactly what I want.

## What I Love Most

As I've alluded to, one of my favorite parts about Astro is its **content-driven** approach. Astro lets me focus on writing my content by providing [helpful primitives](https://docs.astro.build/en/reference/api-reference/) like `Astro.glob`, which makes iterating over my blog posts a breeze by handling the frontmatter parsing for me. It would probably only be a few lines to implement myself, but it all adds up: this was the fastest I'd ever been to build out my website to the point it's at right now.

Of course, I would be remiss to talk about Astro without mentioning their [Islands](https://docs.astro.build/en/concepts/islands/) architecture. While I've yet to implement any Islands on my site, the idea is incredibly attractive. While I don't have much of an opinion on being able to use multiple frameworks at once (though I am happy that [they support Solid](https://docs.astro.build/en/guides/integrations-guide/solid-js/)), I absolutely love Islands for the ability to _add in_ reactivity, rather than being a feature _by default_. This opt-in support for reactivity helps drastically reduce the amount of JavaScript sent to the browser. In fact, [nothing](https://docs.astro.build/en/basics/astro-components/) beyond the bare essentials is sent by default. This is one of the things that makes Astro really _feel_ like a static site generator rather than a heavyweight meta framework, even though it supports some of the same features as Next.js, and you can [opt into server rendering](https://docs.astro.build/en/basics/rendering-modes/#on-demand-rendered).

This theme of opt-in complexity one of [the Astro team's explicit goals](https://docs.astro.build/en/concepts/why-astro/#easy-to-use), and it clearly shows in what they've built.

As someone who doesn't love web development, Astro has honestly been able to make writing a website somewhat _fun_. By far the vast majority of what I'm writing is ordinary HTML, which strips out the complexity introduced by React or Vue. And customization is easy: Astro offers a [first-party integration](https://docs.astro.build/en/guides/integrations-guide/tailwind/) for [Tailwind](https://tailwindcss.com), which made setup as simple as running `npx astro add tailwind` in my terminal.

Which brings me to my next task:

# Making Things Pretty With Tailwind

Uncharacteristically for me, I held off on styling my site until I had finished the tutorial, which, now, seems like by far the better way to do things. I suppose I simply hate looking at plain HTML, which is why I always did it concurrently before. I've been using Tailwind for styling ever since I switched away from [Bulma](https://bulma.io), and I absolutely love it.

Most of this comes from the fact that I don't have to remember class names because Tailwind offers [IntelliSense](https://github.com/tailwindlabs/tailwindcss-intellisense) for [Visual Studio Code](https://code.visualstudio.com), my editor of choice, which provides me with autocompletion. I also love not having to mess with separate CSS files, and Tailwind offers sane defaults without sacrificing customizability like some established CSS frameworks (i.e. Bulma, [Bootstrap](https://getbootstrap.com)).

One of the things that really stood out to me this time around was how easy it is with Tailwind to create responsive styles using the `prefers-color-scheme` media query[^2]. Combined with Catppuccin's [Tailwind plugin](https://github.com/catppuccin/tailwindcss), my entire handling for system theme preferences is simply `latte dark:frappe`[^3] in my base Astro [layout](https://docs.astro.build/en/basics/layouts/). With Catppuccin's plugin, I didn't have to deal with adjusting colors based on whether light or dark mode is currently active[^4].

And with that, my technology stack is _almost_ complete. All I needed now was a domain and somewhere to host the site.

# Publishing

## Cloudflare

For the former, I chose Cloudflare, for three reasons.

1. They support the `.dev` gTLD, and it was incredibly cheap per year -- just over $10.
2. I can easily set up a [R2 bucket](https://www.cloudflare.com/developer-platform/r2/) on my [own subdomain](https://files.alainacn.dev), which I'm using to host some of the supplemental content I publish.
3. DNS resolution and updates are [lightning fast](https://www.cloudflare.com/application-services/products/dns/), providing an excellent experience.

## Vercel

For hosting, I decided to go with Vercel once again, after spending months on GitHub Pages, and the reason for this is that Vercel [supports preview deployments](https://vercel.com/docs/deployments/preview-deployments), which allow me to upload drafts of posts like this one as a public preview ([drafts.alainacn.dev](https://drafts.alainacn.dev)) for readers to see as they'll appear when published and offer feedback.

# A Brief Note on Analytics

For the sake of transparency, I'm using the cloud version of [Umami](https://umami.is), a privacy preserving [open-source](https://github.com/umami-software/umami) analytics tool. Data is stored on EU servers, and you can check out the exact same dashboard I see [here](https://cloud.umami.is/share/vCIqThw4NIVycoX1/alainacn.dev).

# Conclusion

Web development can actually be kind of enjoyable and not a massive pain? I've learned a lot in the past three-ish years, and I can finally ~~center a div by memory~~ develop sites without slamming my head against the wall (purely metaphorical, don't worry), which is very nice. A natural consequence of spending hundreds of hours on any pursuit.

I now know the value of choosing _the appropriate tool for the project_, and also of not doing _more_ than I really should. I'm happy to say that I'm finally at a place where I'm satisfied with my site and hopefully, this iteration lasts a bit longer than my previous ones.

-- Alaina

_You can find my website on GitHub [here](https://github.com/alythical/alainacn.dev)_.

[^1]: Superceded by [Draft Mode](https://nextjs.org/docs/pages/building-your-application/configuring/draft-mode). I hardly remember them introducing this (wow it's been a long time)
[^2]: It seems like more effort than it's really worth to create a manual toggle for color scheme, so I decided not to mess with it this time around
[^3]: `latte` and `frappe` are different color schemes within the Catppuccin project. `latte` is a light color scheme, and `frappe` is one of their three dark color schemes. These CSS classes determine which variants of colors are going to be used
[^4]: For an example of this, check out Tailwind's example for dark mode on their [home page](https://tailwindcss.com/#dark-mode)
