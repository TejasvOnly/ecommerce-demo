"use client";

import { useEffect, useMemo, useState } from "react";
import OTPInput from "react-otp-input";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

export default function Verify() {
  const [otp, setOtp] = useState("39022421");
  const [email, setEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
    else router.push(`/`);
  }, [searchParams]);

  const verificationCall = api.user.verify.useMutation({
    onSuccess: (res) => {
      console.log({ res });
      router.push(`/login`);
    },
    onError: (e) => {
      console.log({ e });
    },
  });

  return (
    <div className="container">
      <h1 className="my-[20px] text-[24px] font-semibold md:text-[32px]">
        Verify your email
      </h1>
      <div className="flex flex-col items-center">
        <span> Enter the 8 digit code you have received on</span>
        <span className="font-medium">
          {email
            .split("@")
            .map((x, i) => (i === 0 ? x.slice(0, 3) + "****" : x))
            .join("@")}
        </span>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          verificationCall.mutate({ otp, email });
        }}
      >
        <label className="mb-9" htmlFor="otp">
          Code
        </label>
        <OTPInput
          inputStyle={{ width: "46px", height: "48px" }}
          numInputs={8}
          onChange={setOtp}
          renderSeparator={<div className="h-1 w-3"></div>}
          value={otp}
          inputType={"text"}
          renderInput={(props) => {
            const propsWithClasses = {
              ...props,
              className:
                "rounded-[6px] border border-dull-border font-bold text-center text-2xl",
            };
            return <input {...propsWithClasses} />;
          }}
          shouldAutoFocus
        />
        <button className="button">VERIFY</button>
      </form>
    </div>
  );
}
