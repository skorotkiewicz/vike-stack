export default Page;

import { reload } from "vike/client/router";
import { usePageContext } from "vike-react/usePageContext";
import { hc } from "hono/client";

import type { AuthRPCType } from "~/lib/auth";
import User from "./User";

function Page() {
  const client = hc<AuthRPCType>("/");
  const session = usePageContext().auth ?? {};

  return (
    <>
      <h1>Account</h1>
      <button
        onClick={async (e) => {
          e.preventDefault();
          await client.api.auth.logout.$post();
          await reload();
        }}
      >
        Logout
      </button>
      <pre>{JSON.stringify(session, null, 2)}</pre>

      <User id={session.id} />
    </>
  );
}
