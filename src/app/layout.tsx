import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Header } from "~/components/header";

export const metadata: Metadata = {
    title: "Ecommerce Demo",
    description: "Ecommerce Demo using t3-app",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={inter.className}>
            <body>
                <TRPCReactProvider>
                    <>
                        <Header />
                        <main className="flex justify-center">{children}</main>
                    </>
                </TRPCReactProvider>
            </body>
        </html>
    );
}
