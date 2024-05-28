# vike-stack

- Base
  - [Vike](https://vike.dev)
  - [Hono](https://hono.dev)
  - [React](https://react.dev/learn)
  - [Telefunc](https://telefunc.com)
- Auth
  - [Lucia Auth](https://lucia-auth.com)
    - @lucia-auth/adapter-prisma
  - [Prisma ORM](https://www.prisma.io)

## Next steps

### Setup _Prisma_

Run the following command once:

1. Run `npx prisma init`

Then:

2. Run `npx prisma db pull` to turn your database schema into a Prisma schema.
3. Run `npx prisma generate` to generate the Prisma Client.
4. Run `npx prisma db push` to push scheme to database.
5. Run `npx prisma migrate dev` to regenerate schema (if scheme change)

### Example .env file

```sh
# postgres:
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

# sqlite
DATABASE_URL="file:./dev.db"
```

### Imports

With one simple alias `~/`

```tsx
import { Input } from "~/components/Input";
```

### Run

```
# yarn dev
or
# bun run dev
```

# About this app

This app is ready to start. It's powered by [Vike](https://vike.dev) and [React](https://react.dev/learn).

### `/pages/+config.ts`

Such files are [the interface](https://vike.dev/config) between Vike and your code. It defines:

- A default [`<Layout>` component](https://vike.dev/Layout) (that wraps your [`<Page>` components](https://vike.dev/Page)).
- A default [`title`](https://vike.dev/head).
- Default [`<head>` tags](https://vike.dev/head).

### Routing

[Vike's built-in router](https://vike.dev/routing) lets you choose between:

- [Filesystem Routing](https://vike.dev/filesystem-routing) (the URL of a page is determined based on where its `+Page.jsx` file is located on the filesystem)
- [Route Strings](https://vike.dev/route-string)
- [Route Functions](https://vike.dev/route-function)

### `/pages/_error/+Page.jsx`

The [error page](https://vike.dev/error-page) which is rendered when errors occur.

### `/pages/+onPageTransitionStart.ts` and `/pages/+onPageTransitionEnd.ts`

The [`onPageTransitionStart()` hook](https://vike.dev/onPageTransitionStart), together with [`onPageTransitionEnd()`](https://vike.dev/onPageTransitionEnd), enables you to implement page transition animations.

### SSR

SSR is enabled by default. You can [disable it](https://vike.dev/ssr) for all your pages or only for some pages.

### HTML Streaming

You can enable/disable [HTML streaming](https://vike.dev/streaming) for all your pages, or only for some pages while still using it for others.
