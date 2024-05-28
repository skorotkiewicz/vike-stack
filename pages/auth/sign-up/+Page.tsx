import React, { useState } from "react";
import { navigate } from "vike/client/router";
import { hc } from "hono/client";

import type { AuthRPCType } from "~/lib/auth";
import { Input } from "~/components/Input";

const Page = () => {
  const client = hc<AuthRPCType>("/");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await client.api.auth.register.$post({
        json: {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
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
      <h2>Sign Up Page</h2>

      <form onSubmit={handleSubmit}>
        <Input
          id="firstName"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          id="lastName"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
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
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
