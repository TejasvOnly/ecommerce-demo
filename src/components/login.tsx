"use client";

import Link from "next/link";
import { Input } from "./input";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { SESSION_KEY } from "~/lib/constants";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const loginCall = api.user.login.useMutation({
    onSuccess: (res) => {
      Cookies.set(SESSION_KEY, res.session, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      router.push("/");
    },
    onError: (e) => {
      console.log({ e });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        loginCall.mutate({
          email: email,
          password: password,
        });
      }}
      className="container"
    >
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
        error={loginCall.error?.data?.zodError?.fieldErrors?.email?.join("\n")}
      />
      <Input
        onChange={setPassword}
        inputType="password"
        placeholder="Enter"
        label="password"
        value={password}
        error={loginCall.error?.data?.zodError?.fieldErrors?.password?.join(
          "\n",
        )}
      />

      <span className="text-sm text-red-400">
        {!loginCall.error?.data?.zodError && loginCall.error?.message}
      </span>
      <button className="button">
        {loginCall.isPending ? "SUBMITTING..." : "LOGIN"}
      </button>
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
