"use client";

import { useState } from "react";
import OTPInput from "react-otp-input";
import { useRouter } from "next/navigation";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  return (
    <div className="container">
      <h1 className="my-[20px] text-[24px] font-semibold md:text-[32px]">
        Verify your email
      </h1>
      <div className="flex flex-col items-center">
        <span> Enter the 8 digit code you have received on</span>
        <span className="font-medium">swa***@gmail.com</span>
      </div>
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          router.push("/interest");
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
