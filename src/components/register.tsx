"use client";

import { useState } from "react";
import { Input } from "./input";

import { useRouter } from "next/navigation";
import Link from "next/link";

export const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  return (
    <form
      onSubmit={(e: any) => {
        e.preventDefault();
        router.push("/verify");
      }}
      className="container"
    >
      <h1 className="my-[20px] text-[24px] font-semibold md:text-[32px]">
        Create your account
      </h1>
      <Input
        onChange={setName}
        inputType="text"
        placeholder="Enter"
        label="name"
        value={name}
      />
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
      <button className="button">CREATE AN ACCOUNT</button>

      <div className="mt-10">
        <span className="text-dull-dark">Have an Account?</span>
        <Link
          className="ml-2 font-medium capitalize tracking-widest"
          href="/login"
        >
          LOGIN
        </Link>
      </div>
    </form>
  );
};
