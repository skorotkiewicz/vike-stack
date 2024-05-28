import React, { useState } from "react";
import { navigate } from "vike/client/router";
import { hc } from "hono/client";

import type { AuthRPCType } from "~/lib/auth";
import { Input } from "~/components/Input";

const Page = () => {
  const client = hc<AuthRPCType>("/");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await client.api.auth.login.$post({
        json: {
          email,
          password,
        },
      });

      if (response.ok) {
        await navigate("/account");
      } else {
        setError(await response.text());
      }
    } catch (err) {
      setError("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <>
      <h2>Sign In Page</h2>

      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div id="validation" style={{ color: "#f00" }}>
          {error}
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Page;
