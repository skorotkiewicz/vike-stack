import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

export function Input({ id, ...props }: InputProps) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontSize: "0.91em" }}>{id}</span>
      <br />
      <input id={id} size={20} {...props}></input>
    </label>
  );
}
