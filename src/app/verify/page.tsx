import dynamic from "next/dynamic";

const VerifyEmailPage = dynamic(() => import("~/components/verify"), {
  ssr: false,
});

export default VerifyEmailPage;
