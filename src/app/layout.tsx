import "@coinbase/onchainkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from "../../context";

export const metadata: Metadata = {
  title: "Coinbase Onramp & Offramp Demo",
  description:
    "A demo application showcasing Coinbase Onramp and Offramp integration",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en" className="light">
      <body className="bg-background" suppressHydrationWarning={true}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
