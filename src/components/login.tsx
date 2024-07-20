"use client";

import Link from "next/link";
import { Input } from "./input";
import { useState } from "react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form onSubmit={() => {}} className="container">
      <h1 className="my-4 text-[24px] font-semibold md:text-[32px]">Login</h1>
      <h1 className="mb-2 text-[16px] font-semibold md:text-[18px]">
        Welcome to back ECOMMERCE
      </h1>
      <h1 className="mb-8 text-[14px] text-dull-dark">
        The next gen business marketplace
      </h1>
      <Input
        onChange={setEmail}
        inputType="email"
        placeholder="Enter"
        label="email"
        value={email}
      />
      <Input
        onChange={setPassword}
        inputType="password"
        placeholder="Enter"
        label="password"
        value={password}
      />
      <button className="button">LOGIN</button>
      <div className="mt-10">
        <span className="text-dull-dark">Don't have an Account?</span>
        <Link
          className="ml-2 font-medium capitalize tracking-widest"
          href="/register"
        >
          SIGN UP
        </Link>
      </div>
    </form>
  );
};
