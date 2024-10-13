# [sydneyn.dev](https://sydneyn.dev)

My personal corner of the internet!

- **Static Site Generation**: [Astro](https://astro.build)
- **Styling**: [Tailwind](https://tailwindcss.com)
- **Content**: [MDX](https://mdxjs.com/) with [remark-rehype](https://github.com/remarkjs/remark-rehype) for rendering to HTML
- **Hosting**: [Vercel](https://vercel.com) with [Cloudflare](https://www.cloudflare.com) for supportive services ([R2](https://www.cloudflare.com/developer-platform/r2/), [DNS](https://www.cloudflare.com/application-services/products/dns/), [Registrar](https://developers.cloudflare.com/registrar/), [Image Transformations](https://developers.cloudflare.com/images/transform-images/), [Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/))
- **Analytics**: [Umami](https://umami.is) ([public view](https://sydneyn.dev/analytics))

## Develop

### Running

1. Install dependencies: `npm i`
2. Set the necessary environment variables (below) in `.env`
3. Run the development server: `npm run dev`
4. Navigate to http://localhost:4321

```env
R2_BUCKET_NAME=""
R2_SECRET_ACCESS_KEY=""
R2_ACCESS_KEY_ID=""
R2_ACCOUNT_ID=""
```

## License

All of the code is licensed under the [MIT license](https://opensource.org/licenses/mit), and all of the prose content I write is [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Refer to the license text for details.
