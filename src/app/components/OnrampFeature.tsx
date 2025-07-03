"use client";

/**
 * @title OnrampFeature Component
 * @notice Main component for Coinbase Onramp integration providing comprehensive crypto purchase functionality
 * @dev Handles wallet connections, guest checkout, secure session tokens, and URL generation
 * @author Meet - Coinbase Onramp Integration Demo
 */

import { useState } from "react";
// Removed wallet imports since we're using guest checkout only
import { generateOnrampURL } from "../utils/rampUtils";
// import {
//   validateAddressForNetwork,
//   getExampleAddress,
// } from "../utils/addressValidation"; // COMMENTED OUT FOR EXPERIMENT - Using universal validation now
// Removed GeneratedLinkModal import - no longer needed since we directly open URLs
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"; // COMMENTED OUT FOR EXPERIMENT
// Removed AppKitConnectButton import - not needed for guest checkout

/**
 * @dev US States configuration for location-specific onramp requirements
 * @notice Used for compliance and payment method availability
 */
const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

/**
 * @dev Supported cryptocurrency assets for onramp purchases
 * @notice Limited to verified guest checkout compatible assets only
 * @dev Removed: BTC, FIL, and other assets that fail session token generation
 */
const ASSETS = [
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "MATIC", name: "Polygon" },
];

/**
 * @dev Supported blockchain networks for crypto delivery
 * @notice Limited to verified guest checkout compatible networks only
 * @dev Removed: bitcoin, filecoin, and other networks that cause session failures
 */
const NETWORKS = [
  { id: "ethereum", name: "Ethereum" },
  { id: "base", name: "Base" },
  { id: "optimism", name: "Optimism" },
  { id: "polygon", name: "Polygon" },
  { id: "arbitrum", name: "Arbitrum" },
  { id: "solana", name: "Solana" },
].sort((a, b) => a.name.localeCompare(b.name));

/**
 * @dev Asset-Network compatibility mapping - COMMENTED OUT FOR EXPERIMENT
 * @notice Limited to verified working combinations for guest checkout
 * @dev Removed problematic combinations that fail session token generation
 */
// const ASSET_NETWORK_MAP: Record<string, string[]> = {
//   // ETH - EVM networks only (verified working)
//   ETH: ["ethereum", "base", "optimism", "arbitrum", "polygon"],

//   // USDC - Most widely supported stablecoin (verified working)
//   USDC: ["ethereum", "base", "optimism", "arbitrum", "polygon", "solana"],

//   // SOL - Solana native token (verified working)
//   SOL: ["solana"],

//   // MATIC - Polygon native token (verified working)
//   MATIC: ["polygon", "ethereum"],
// };

/**
 * @dev Supported fiat currencies for payments
 * @notice Availability depends on user's country and payment method
 */
const PAYMENT_CURRENCIES = [
  { code: "USD", name: "US Dollar (USD)" },
  { code: "EUR", name: "Euro (EUR)" },
  { code: "GBP", name: "British Pound (GBP)" },
  { code: "CAD", name: "Canadian Dollar (CAD)" },
  { code: "AUD", name: "Australian Dollar (AUD)" },
  { code: "JPY", name: "Japanese Yen (JPY)" },
  { code: "CHF", name: "Swiss Franc (CHF)" },
  { code: "SGD", name: "Singapore Dollar (SGD)" },
];

/**
 * @dev Supported payment methods with regional availability - COMMENTED OUT FOR EXPERIMENT
 * @notice Each method has different processing times and limits
 * @dev Only includes methods officially supported by Coinbase Onramp API
 */
// const PAYMENT_METHODS = [
//   {
//     code: "CARD",
//     name: "Debit Card",
//     description: "Debit or Credit Card (Available in 90+ countries)",
//   },
//   {
//     code: "ACH_BANK_ACCOUNT",
//     name: "ACH Bank Transfer",
//     description: "ACH Bank Transfer (US only)",
//   },
//   {
//     code: "APPLE_PAY",
//     name: "Apple Pay",
//     description: "Apple Pay (US only, Guest Checkout)",
//   },
//   // Temporarily commented out payment methods not confirmed as supported
//   // {
//   //   code: "BANK_TRANSFER",
//   //   name: "Bank Transfer",
//   //   description: "Direct bank transfer",
//   // },
//   // {
//   //   code: "SEPA_BANK_ACCOUNT",
//   //   name: "SEPA",
//   //   description: "SEPA Bank Transfer (Europe)",
//   // },
//   // { code: "IDEAL", name: "iDEAL", description: "iDEAL (Netherlands)" },
//   // { code: "SOFORT", name: "SOFORT", description: "SOFORT (Europe)" },
//   // { code: "GOOGLE_PAY", name: "Google Pay", description: "Google Pay" },
//   // { code: "PAYPAL", name: "PayPal", description: "PayPal" },
// ];

/**
 * @notice Main OnrampFeature React component
 * @dev Provides complete Coinbase onramp integration with multi-wallet support
 * @return JSX.Element The rendered onramp interface
 */
export default function OnrampFeature() {
  // Removed wallet connection hooks - using guest checkout only

  // Core onramp configuration state
  // const [selectedAsset, setSelectedAsset] = useState("USDC"); // Cryptocurrency to purchase - COMMENTED OUT FOR EXPERIMENT
  // const [amount, setAmount] = useState("5"); // Fiat amount to spend - COMMENTED OUT FOR EXPERIMENT
  const selectedAsset = "USDC"; // Fixed value since asset selection is disabled
  // const amount = "5"; // Fixed value since amount selection is disabled - COMMENTED OUT FOR EXPERIMENT
  // const [selectedNetwork, setSelectedNetwork] = useState("ethereum"); // Blockchain network for delivery - COMMENTED OUT FOR EXPERIMENT
  // const selectedNetwork = "ethereum"; // Fixed value since network selection is disabled - COMMENTED OUT FOR EXPERIMENT (now using dynamic detection)

  // Removed connection status - not needed for guest checkout

  // UI state management
  // Removed generatedUrl state since we now directly open URLs // Generated Coinbase onramp URL
  // Removed showUrlModal state since we now directly open URLs

  // Geographic and compliance settings - Fixed to US only
  // const [selectedCountry] = useState("US"); // Fixed to US only - COMMENTED OUT FOR EXPERIMENT
  // Removed state selection for experiment

  // Security and session management - always enabled for proper functionality
  const [useSecureInit] = useState(true); // Always enabled - required for valid session tokens
  const [isGeneratingToken, setIsGeneratingToken] = useState(false); // Token generation loading state

  // Payment configuration
  // const [selectedPaymentCurrency, setSelectedPaymentCurrency] = useState("USD"); // Fiat currency - COMMENTED OUT FOR EXPERIMENT
  // const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("CARD"); // Payment method - COMMENTED OUT FOR EXPERIMENT

  // Integration mode and wallet handling - simplified to single mode
  const [integrationMode] = useState("API"); // Fixed to API mode only
  const [manualAddress, setManualAddress] = useState(""); // Manual wallet address for guest checkout
  const [useManualAddress, setUseManualAddress] = useState(true); // Guest checkout toggle - DEFAULT FOR EXPERIMENT

  // const presetAmounts = ["2", "5", "10"]; // COMMENTED OUT FOR EXPERIMENT

  /**
   * @notice Generates a secure session token for enhanced onramp security
   * @dev Calls the server-side API to create JWT tokens using CDP credentials
   * @return Promise<string | null> The generated session token or null if failed
   */
  const generateSessionToken = async () => {
    setIsGeneratingToken(true);
    try {
      const targetAddress = manualAddress; // Always use manual address for guest checkout

      if (!targetAddress) {
        throw new Error("No wallet address available");
      }

      // Validate address format (universal validation)
      if (!isValidAnyAddress(targetAddress)) {
        alert(
          "Please enter a valid wallet address (EVM, Solana, or Bitcoin format)."
        );
        throw new Error("Address validation failed: Invalid address format");
      }

      // Prepare addresses array with the dynamically detected network
      const detectedNetwork = getNetworkForAddress(targetAddress);
      const addresses = [
        {
          address: targetAddress,
          blockchains: [detectedNetwork], // Include the specific network (solana, ethereum, base, etc.)
        },
      ];

      console.log(
        `Address validation passed: ${targetAddress} is valid for ${detectedNetwork} network`
      );

      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addresses,
          assets: [selectedAsset],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate session token");
      }

      const data = await response.json();
      if (data.token) {
        return data.token;
      } else {
        throw new Error("Failed to generate session token");
      }
    } catch (error) {
      console.error("Session token generation failed:", error);
      return null;
    } finally {
      setIsGeneratingToken(false);
    }
  };

  /**
   * @notice Handles direct integration with Coinbase Pay
   * @dev Opens Coinbase Pay in a new tab for immediate purchase
   */
  const handleBuyWithCoinbase = () => {
    // This would integrate with the Coinbase onramp API directly
    window.open("https://pay.coinbase.com", "_blank");
  };

  /**
   * @notice Main handler for initiating the onramp process
   * @dev Validates inputs, generates session tokens if enabled, and creates onramp URL
   * @return Promise<void> Handles the complete onramp flow
   */
  const handleOnramp = async () => {
    // Since guest checkout is now default, always use manual address
    const targetAddress = manualAddress;

    // Validation: Ensure we have a destination address (guest checkout mode)
    if (!targetAddress) {
      alert("Please enter a valid wallet address to continue.");
      return;
    }

    // Validate address format (universal validation for any supported address type)
    if (targetAddress && !isValidAnyAddress(targetAddress)) {
      alert(
        "Please enter a valid wallet address (EVM, Solana, or Bitcoin format)."
      );
      return;
    }

    // Generate secure session token if enabled
    let sessionToken = undefined;
    if (useSecureInit) {
      sessionToken = await generateSessionToken();
      if (!sessionToken) {
        alert("Could not generate session token. Please try again.");
        return;
      }
    }

    const url = generateOnrampURL({
      sessionToken,
      // asset: selectedAsset, // COMMENTED OUT FOR EXPERIMENT
      // amount: amount, // Optional when using session tokens according to Coinbase docs
      // network: selectedNetwork, // COMMENTED OUT FOR EXPERIMENT
      // paymentMethod: selectedPaymentMethod, // COMMENTED OUT FOR EXPERIMENT
      // paymentCurrency: selectedPaymentCurrency, // COMMENTED OUT FOR EXPERIMENT
      address: targetAddress,
      // redirectUrl: window.location.href, // COMMENTED OUT FOR EXPERIMENT
      // country: selectedCountry, // COMMENTED OUT FOR EXPERIMENT
      // state: selectedState, // Not needed for our setup
    });

    // Directly open the URL instead of showing modal
    window.open(url, "_blank");
  };

  // Removed handleCopyUrl and handleOpenUrl since we now directly open URLs

  // const getAssetDisplayName = (symbol: string) => {
  //   const asset = ASSETS.find((a) => a.symbol === symbol);
  //   return asset ? `${asset.name} (${symbol})` : symbol;
  // }; // COMMENTED OUT FOR EXPERIMENT

  // const getNetworkInfo = (networkId: string) => {
  //   const network = NETWORKS.find((n) => n.id === networkId);
  //   return network ? network.name : networkId;
  // }; // COMMENTED OUT FOR EXPERIMENT

  // const selectedPaymentMethodInfo = PAYMENT_METHODS.find(
  //   (pm) => pm.code === selectedPaymentMethod
  // ); // COMMENTED OUT FOR EXPERIMENT

  const getConnectorDisplayName = (connectorId: string) => {
    switch (connectorId) {
      case "coinbaseWalletSDK":
        return "Coinbase Wallet";
      case "metaMask":
        return "MetaMask";
      case "walletConnect":
        return "WalletConnect";
      default:
        return connectorId;
    }
  };

  // Universal address validation function
  const isValidAnyAddress = (address: string): boolean => {
    if (!address) return false;

    const normalizedAddress = address.trim();

    // EVM address (Ethereum, Base, Polygon, etc.)
    if (/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
      return true;
    }

    // Solana address
    if (
      /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(normalizedAddress) &&
      !normalizedAddress.startsWith("0x")
    ) {
      return true;
    }

    // Bitcoin address
    if (
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(normalizedAddress) ||
      /^bc1[a-z0-9]{39,59}$/.test(normalizedAddress)
    ) {
      return true;
    }

    return false;
  };

  // Get address type for display
  const getAddressType = (address: string): string => {
    if (!address) return "Unknown";

    const normalizedAddress = address.trim();

    if (/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
      return "EVM";
    }

    if (
      /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(normalizedAddress) &&
      !normalizedAddress.startsWith("0x")
    ) {
      return "Solana";
    }

    if (
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(normalizedAddress) ||
      /^bc1[a-z0-9]{39,59}$/.test(normalizedAddress)
    ) {
      return "Bitcoin";
    }

    return "Unknown";
  };

  // Get the correct network for session token generation based on address type
  const getNetworkForAddress = (address: string): string => {
    if (!address) return "ethereum"; // Default fallback

    const normalizedAddress = address.trim();

    // EVM address - use ethereum as the primary network
    if (/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
      return "ethereum";
    }

    // Solana address - use solana network
    if (
      /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(normalizedAddress) &&
      !normalizedAddress.startsWith("0x")
    ) {
      return "solana";
    }

    // Bitcoin address - use bitcoin network
    if (
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(normalizedAddress) ||
      /^bc1[a-z0-9]{39,59}$/.test(normalizedAddress)
    ) {
      return "bitcoin";
    }

    return "ethereum"; // Default fallback
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-center mb-2">
              <span className="text-sm font-medium text-gray-400 tracking-wider uppercase">
                Powered by
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                Metakeep
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Onramp
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"></p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white"></h2>

            {/* Integration Mode Tabs - Commented out as requested */}
            {/* 
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setIntegrationMode("API")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                integrationMode === "API"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Onramp API
            </button>
            <button
              onClick={() => setIntegrationMode("LINK")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                integrationMode === "LINK"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              One-time Payment Link
            </button>
          </div>
          */}

            {/* Country and State Selection - REMOVED FOR EXPERIMENT */}
            {/* Fixed to US only, no user selection needed */}

            {/* Asset Selection - COMMENTED OUT FOR EXPERIMENT */}
            {/*
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Asset
              </label>
              <Select
                value={selectedAsset}
                onValueChange={(newAsset) => {
                  setSelectedAsset(newAsset);

                  // Update network if current selection is incompatible with new asset
                  const compatibleNetworks = ASSET_NETWORK_MAP[newAsset];
                  if (
                    compatibleNetworks &&
                    !compatibleNetworks.includes(selectedNetwork)
                  ) {
                    setSelectedNetwork(compatibleNetworks[0]); // Set to first compatible network
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {ASSETS.map((asset) => {
                    const isCompatible =
                      ASSET_NETWORK_MAP[asset.symbol]?.includes(
                        selectedNetwork
                      ) || !ASSET_NETWORK_MAP[asset.symbol];
                    return (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        {asset.name} ({asset.symbol})
                        {!isCompatible
                          ? " - Not available on " +
                            getNetworkInfo(selectedNetwork)
                          : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            */}

            {/* Network Selection - COMMENTED OUT FOR EXPERIMENT */}
            {/*
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Network
              </label>
              <Select
                value={selectedNetwork}
                onValueChange={setSelectedNetwork}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a network" />
                </SelectTrigger>
                <SelectContent>
                  {NETWORKS.filter(
                    (network) =>
                      ASSET_NETWORK_MAP[selectedAsset]?.includes(network.id) ||
                      !ASSET_NETWORK_MAP[selectedAsset] // Show all networks if no mapping exists
                  ).map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      {network.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {selectedAsset} is available on{" "}
                {ASSET_NETWORK_MAP[selectedAsset]?.length || NETWORKS.length}{" "}
                network
                {(ASSET_NETWORK_MAP[selectedAsset]?.length || NETWORKS.length) >
                1
                  ? "s"
                  : ""}
              </p>
            </div>
            */}

            {/* Amount - COMMENTED OUT FOR EXPERIMENT */}
            {/*
            <div className="mb-4">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Amount
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset)}
                    className="flex-shrink-0"
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-base font-medium">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="pl-8"
                  placeholder="0"
                />
              </div>
            </div>
            */}

            {/* Payment Currency - COMMENTED OUT FOR EXPERIMENT */}
            {/*
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Currency
            </label>
            <select
              value={selectedPaymentCurrency}
              onChange={(e) => setSelectedPaymentCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {PAYMENT_CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>
          */}

            {/* Payment Method - COMMENTED OUT FOR EXPERIMENT */}
            {/* 
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method.code} value={method.code}>
                  {method.name}
                </option>
              ))}
            </select>
            {selectedPaymentMethodInfo && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {selectedPaymentMethodInfo.description}
              </p>
            )}
          </div>
          */}

            {/* Guest Checkout Address - DEFAULT FOR EXPERIMENT */}
            <div className="mb-6">
              {/* COMMENTED OUT TOGGLE - Guest checkout is now default */}
              {/* 
            <div className="flex items-center justify-between py-3 px-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center">
                <input
                  id="manual-address"
                  type="checkbox"
                  checked={useManualAddress}
                  onChange={(e) => setUseManualAddress(e.target.checked)}
                  className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="manual-address"
                  className="ml-3 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Use Guest Checkout (Enter Wallet Address)
                </label>
              </div>
            </div>
            */}

              {/* Always show address input since guest checkout is default */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination Wallet Address
                </label>
                <Input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Enter any valid wallet address (EVM, Solana, etc.)"
                  className={`font-mono text-sm ${
                    manualAddress && !isValidAnyAddress(manualAddress)
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-orange-500"
                  }`}
                />
                {manualAddress && !isValidAnyAddress(manualAddress) && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Invalid address format. Please enter a valid EVM (0x...) or
                    Solana address.
                  </p>
                )}
                {manualAddress && isValidAnyAddress(manualAddress) && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Valid wallet address detected (
                    {getAddressType(manualAddress)})
                  </p>
                )}
                {!manualAddress && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter any valid wallet address where you want to receive the
                    crypto
                  </p>
                )}
              </div>
            </div>

            {/* Security Status - Always Enabled */}
          </div>

          {/* Right Column - Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Preview
            </h2>

            {/* Wallet Connection Section - COMMENTED OUT FOR EXPERIMENT */}
            {/* Guest checkout is now default, no wallet connection needed */}
            {/*
          {!useManualAddress && (
            <div className="mb-6">
              {!isConnected ? (
                <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
                    Connect your wallet to continue
                  </p>
                  {connectionStatus && (
                    <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border text-center">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {connectionStatus}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-center">
                    <AppKitConnectButton />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-600 dark:text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Wallet Connected
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-mono">
                          {address
                            ? `${address.slice(0, 6)}...${address.slice(-4)}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <AppKitConnectButton />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          */}

            {/* Guest Checkout Info */}
            {useManualAddress && (
              <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Guest Checkout Mode
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    {manualAddress
                      ? `Crypto will be sent to: ${manualAddress.slice(
                          0,
                          6
                        )}...${manualAddress.slice(-4)}`
                      : "Enter a wallet address to receive crypto"}
                  </p>
                </div>
              </div>
            )}

            {/* Transaction Summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Transaction Summary
              </h3>
              <div className="space-y-2 text-sm">
                {/* Amount and Asset display - COMMENTED OUT FOR EXPERIMENT */}
                {/*
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Amount:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    ${amount} {selectedPaymentCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Asset:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {getAssetDisplayName(selectedAsset)}
                  </span>
                </div>
                */}
                {/* Network display - COMMENTED OUT FOR EXPERIMENT */}
                {/*
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Network:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {getNetworkInfo(selectedNetwork)}
                  </span>
                </div>
                */}
                {/* Payment method display - COMMENTED OUT FOR EXPERIMENT */}
                {/*
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Payment:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {selectedPaymentMethodInfo?.name}
                  </span>
                </div>
                */}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Destination:
                  </span>
                  <span className="text-gray-900 dark:text-white font-mono text-xs">
                    {useManualAddress
                      ? manualAddress
                        ? `${manualAddress.slice(0, 6)}...${manualAddress.slice(
                            -4
                          )}`
                        : "Not set"
                      : "Guest checkout only"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Mode:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {useManualAddress
                      ? "Guest Checkout"
                      : integrationMode === "API"
                      ? "Onramp API"
                      : "Payment Link"}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="mt-6 mb-4">
              <Button
                onClick={handleOnramp}
                disabled={
                  isGeneratingToken || !manualAddress // Always require manual address for guest checkout
                }
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                {isGeneratingToken
                  ? " Generating Session Token..."
                  : integrationMode === "LINK"
                  ? " Generate Payment URL"
                  : " Buy Crypto Now"}
              </Button>

              {/* Status Message */}
              {useManualAddress && !manualAddress && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 text-center"></p>
              )}
              {/* Removed wallet connection message - using guest checkout only */}
            </div>
          </div>
        </div>

        {/* Modal removed - now directly opening URLs */}
      </div>
    </div>
  );
}
