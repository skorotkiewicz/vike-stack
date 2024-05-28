import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { poweredBy } from "hono/powered-by";
import { telefunc } from "telefunc";
import { renderPage } from "vike/server";

import authRoute from "~/lib/auth";

import type { Session, User } from "lucia";

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// const app = new Hono();

const app = new Hono<{
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>();

app.use(poweredBy());
app.use(compress());

app.route("/", authRoute);

if (isProduction) {
  app.use(
    "/*",
    serveStatic({
      root: `dist/client/`,
    })
  );
}

app.post("/_telefunc", async (c) => {
  const httpResponse = await telefunc({
    url: c.req.url.toString(),
    method: c.req.method,
    body: await c.req.text(),
    context: c,
  });
  const { body, statusCode, contentType } = httpResponse;

  c.status(statusCode);
  c.header("Content-Type", contentType);

  return c.body(body);
});

app.all("*", async (c, next) => {
  const pageContextInit = {
    urlOriginal: c.req.url,
    auth: c.get("user"),
  };
  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;
  if (!httpResponse) {
    return next();
  } else {
    const { body, statusCode, headers } = httpResponse;
    headers.forEach(([name, value]) => c.header(name, value));
    c.status(statusCode);

    return c.body(body);
  }
});

if (isProduction) {
  console.log(`Server listening on http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port: port,
  });
}

export default app;
