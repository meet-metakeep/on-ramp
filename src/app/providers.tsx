"use client";

/**
 * @title Application Providers Setup
 * @notice Configures all necessary providers for Web3 functionality and onramp integration
 * @dev Sets up Wagmi, OnchainKit, ReactQuery, and custom ramp transaction providers
 * @author Meet - Coinbase Onramp Integration Demo
 */

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { metaMask, walletConnect, coinbaseWallet } from "wagmi/connectors";

/**
 * @dev React Query client for caching and state management
 */
const queryClient = new QueryClient();

/**
 * @dev WalletConnect/Reown project ID for multi-wallet support
 * @notice Get this from https://cloud.reown.com/ (formerly WalletConnect)
 */
const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "643eb360d09c9e298898828a67671532"; // Your Reown/WalletConnect project ID

/**
 * @dev Wagmi configuration with multiple wallet connectors
 * @notice Supports Coinbase Wallet, MetaMask, and WalletConnect
 */
const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "Coinbase Onramp",
      appLogoUrl: "/coinbase-logo.png",
    }),
    metaMask(),
    walletConnect({
      projectId: walletConnectProjectId,
      metadata: {
        name: "Coinbase Onramp",
        description: "Buy crypto with Coinbase Onramp",
        url: "http://localhost:3000",
        icons: ["/coinbase-logo.png"],
      },
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

/**
 * @notice Main providers wrapper component
 * @dev Wraps the entire application with necessary Web3 and onramp providers
 * @param children React children to be wrapped by providers
 * @return JSX.Element Wrapped application with all providers
 */
export function Providers({ children }: { children: ReactNode }) {
  // Access environment variables with fallback to hardcoded values for demo
  const onchainKitApiKey =
    process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ||
    "plDkTh5QH83EDl6OixJY4zwbNcX9H6zq";
  const projectName =
    process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Coinbase Ramp Demo";
  const cdpProjectId =
    process.env.NEXT_PUBLIC_CDP_PROJECT_ID ||
    "75964b10-8e1e-4941-8c9d-d66697267c71";

  // Log configuration status (without exposing actual values)
  console.log("Provider configuration:", {
    apiKey: onchainKitApiKey ? "Set" : "Not set",
    cdpProjectId: cdpProjectId ? "Set" : "Not set",
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          chain={base}
          projectId={cdpProjectId}
          apiKey={onchainKitApiKey}
          config={{
            appearance: {
              name: projectName,
              theme: "default",
              mode: "light",
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
