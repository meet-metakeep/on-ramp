import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { mainnet, base, solana } from "@reown/appkit/networks";

// Get projectId from environment or use the provided one
export const projectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ||
  "21ff40d70ddca9b627a73b98666a8686";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Define networks - using Base, Ethereum, and Solana
export const networks = [base, mainnet, solana];

// Set up the Wagmi Adapter (Config) for EVM chains
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: "21ff40d70ddca9b627a73b98666a8686", // Explicitly set your project ID
  networks: [base, mainnet], // Only EVM networks for Wagmi
});

// Set up the Solana Adapter
export const solanaAdapter = new SolanaAdapter();

export const config = wagmiAdapter.wagmiConfig;
