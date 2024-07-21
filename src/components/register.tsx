"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "~/components/input";
import { api } from "~/trpc/react";

export const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const signupCall = api.user.register.useMutation({
    onSuccess: (res) => {
      console.log({ res });
      router.push("/verify?" + new URLSearchParams({ email }).toString());
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signupCall.mutate({ name, email, password });
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
        error={signupCall.error?.data?.zodError?.fieldErrors?.name?.join("\n")}
      />
      <Input
        onChange={setEmail}
        inputType="email"
        placeholder="Enter"
        label="email"
        value={email}
        error={signupCall.error?.data?.zodError?.fieldErrors?.email?.join("\n")}
      />
      <Input
        onChange={setPassword}
        inputType="password"
        placeholder="Enter"
        label="password"
        value={password}
        error={signupCall.error?.data?.zodError?.fieldErrors?.password?.join(
          "\n",
        )}
      />

      <span className="text-sm text-red-400">
        {!signupCall.error?.data?.zodError && signupCall.error?.message}
      </span>
      <button className="button">
        {signupCall.isPending ? "SUBMITTING..." : "CREATE AN ACCOUNT"}
      </button>

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
