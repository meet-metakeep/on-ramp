"use client";

import { wagmiAdapter, solanaAdapter, projectId } from "../config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, base, solana } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Debug logging
console.log("🔧 AppKit Configuration:", {
  projectId: projectId ? "Set" : "Not set",
  projectIdValue: projectId,
  networks: [base, mainnet, solana].map((n) => n.name),
});

// Set up metadata
const metadata = {
  name: "Coinbase Onramp",
  description:
    "Buy crypto with Coinbase Onramp - Secure and easy crypto purchases",
  url:
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000",
  icons: ["/coinbase-logo.png"],
};

// Create the modal - this initializes AppKit globally
createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  projectId: "21ff40d70ddca9b627a73b98666a8686", // Explicitly set your project ID
  networks: [base, mainnet, solana],
  defaultNetwork: base,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
