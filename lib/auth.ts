import { Context, Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { User, Session } from "lucia";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { prisma } from "./prisma.js";
import { lucia } from "./lucia.js";
import { CookieOptions } from "hono/utils/cookie";

const app = new Hono<{
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>();

app.use("*", async (c, next) => {
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    setAuthCookie(c, sessionCookie);
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    setAuthCookie(c, sessionCookie);
  }

  c.set("user", user);
  c.set("session", session);

  return next();
});

export const handler = app
  .post("/api/auth/login", async (c) => {
    const { email, password } = await c.req.json();

    const formDataRaw = {
      email: email as string,
      password: password as string,
    };

    try {
      const user = await prisma.user.findUnique({
        where: { email: formDataRaw.email },
      });

      if (!user) {
        return c.text("Incorrect email or password", 400);
      }

      const validPassword = await new Argon2id().verify(
        user.hashedPassword,
        formDataRaw.password
      );

      if (!validPassword) {
        return c.text("Incorrect email or password", 400);
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      setAuthCookie(c, sessionCookie);

      return c.json("ok");
    } catch (error) {}
  })

  .post("/api/auth/register", async (c) => {
    const { firstName, lastName, email, password, confirmPassword } =
      await c.req.json();

    const formDataRaw = {
      firstName: firstName as string,
      lastName: lastName as string,
      email: email as string,
      password: password as string,
      confirmPassword: confirmPassword as string,
    };

    if (formDataRaw.password !== formDataRaw.confirmPassword) {
      return c.text("Passwords do not match", 400);
    }

    try {
      const hashedPassword = await new Argon2id().hash(formDataRaw.password);
      const userId = generateId(15);

      try {
        await prisma.user.create({
          data: {
            id: userId,
            firstName: formDataRaw.firstName,
            lastName: formDataRaw.lastName,
            email: formDataRaw.email,
            hashedPassword,
          },
        });
      } catch (error) {
        return c.text("Something went wrong, try again", 400);
      }

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      setAuthCookie(c, sessionCookie);

      return c.json("ok");
    } catch (error) {
      console.log(error);
    }
  })

  .post("/api/auth/logout", async (c) => {
    if (c.get("user") == null) return;

    await lucia.invalidateSession(c.get("session")?.id ?? "");

    const sessionCookie = lucia.createBlankSessionCookie();
    setAuthCookie(c, sessionCookie);

    return c.json("ok");
  });

export default app;
export type AuthRPCType = typeof handler;

const setAuthCookie = (
  c: Context,
  sessionCookie: { name: string; value: string; attributes: CookieOptions }
) => {
  setCookie(
    c,
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};
