import type { User } from "lucia";

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      auth: User;
    }
  }
}

export {};
