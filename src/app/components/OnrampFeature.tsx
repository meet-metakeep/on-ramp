"use client";

/**
 * @title OnrampFeature Component
 * @notice Main component for Coinbase Onramp integration providing comprehensive crypto purchase functionality
 * @dev Handles wallet connections, guest checkout, secure session tokens, and URL generation
 * @author Meet - Coinbase Onramp Integration Demo
 */

import React, { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { generateOnrampURL } from "../utils/rampUtils";
import { countryNames } from "../utils/onrampApi";
import {
  validateAddressForNetwork,
  getExampleAddress,
} from "../utils/addressValidation";
import GeneratedLinkModal from "./GeneratedLinkModal";
import AppKitConnectButton from "./AppKitConnectButton";

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
 * @notice Each asset has specific network compatibility (see NETWORKS)
 */
const ASSETS = [
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "SOL", name: "Solana" },
  // Temporarily commented out assets that require unavailable networks
  // { symbol: "BTC", name: "Bitcoin" },
  // { symbol: "MATIC", name: "Polygon" },
  // { symbol: "AVAX", name: "Avalanche" },
  // { symbol: "LINK", name: "Chainlink" },
  // { symbol: "UNI", name: "Uniswap" },
  // { symbol: "AAVE", name: "Aave" },
  // { symbol: "DAI", name: "Dai" },
];

/**
 * @dev Supported blockchain networks for crypto delivery
 * @notice Network selection affects transaction fees and confirmation times
 * @dev Only includes networks officially supported by Coinbase Onramp API
 */
const NETWORKS = [
  { id: "base", name: "Base" },
  { id: "ethereum", name: "Ethereum" },
  { id: "solana", name: "Solana" },
  // Temporarily commented out other networks as requested
  // { id: "optimism", name: "Optimism" },
  // { id: "arbitrum", name: "Arbitrum" },
  // { id: "polygon", name: "Polygon" },
  // { id: "avalanche-c-chain", name: "Avalanche" },
  // { id: "bitcoin", name: "Bitcoin" },
];

/**
 * @dev Asset-Network compatibility mapping
 * @notice Defines which assets are available on which networks
 * @dev Based on Coinbase Onramp API supported combinations
 */
const ASSET_NETWORK_MAP: Record<string, string[]> = {
  USDC: ["ethereum", "base", "solana"],
  ETH: ["ethereum", "base"],
  SOL: ["solana"],
  // Temporarily commented out assets that require unavailable networks
  // BTC: ["bitcoin"],
  // MATIC: ["polygon", "ethereum"],
  // AVAX: ["avalanche-c-chain", "ethereum"],
  // LINK: ["ethereum", "base", "arbitrum"],
  // UNI: ["ethereum", "polygon"],
  // AAVE: ["ethereum", "polygon"],
  // DAI: ["ethereum", "polygon"],
};

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
 * @dev Supported payment methods with regional availability
 * @notice Each method has different processing times and limits
 * @dev Only includes methods officially supported by Coinbase Onramp API
 */
const PAYMENT_METHODS = [
  {
    code: "CARD",
    name: "Debit Card",
    description: "Debit or Credit Card (Available in 90+ countries)",
  },
  {
    code: "ACH_BANK_ACCOUNT",
    name: "ACH Bank Transfer",
    description: "ACH Bank Transfer (US only)",
  },
  {
    code: "APPLE_PAY",
    name: "Apple Pay",
    description: "Apple Pay (US only, Guest Checkout)",
  },
  // Temporarily commented out payment methods not confirmed as supported
  // {
  //   code: "BANK_TRANSFER",
  //   name: "Bank Transfer",
  //   description: "Direct bank transfer",
  // },
  // {
  //   code: "SEPA_BANK_ACCOUNT",
  //   name: "SEPA",
  //   description: "SEPA Bank Transfer (Europe)",
  // },
  // { code: "IDEAL", name: "iDEAL", description: "iDEAL (Netherlands)" },
  // { code: "SOFORT", name: "SOFORT", description: "SOFORT (Europe)" },
  // { code: "GOOGLE_PAY", name: "Google Pay", description: "Google Pay" },
  // { code: "PAYPAL", name: "PayPal", description: "PayPal" },
];

/**
 * @notice Main OnrampFeature React component
 * @dev Provides complete Coinbase onramp integration with multi-wallet support
 * @return JSX.Element The rendered onramp interface
 */
export default function OnrampFeature() {
  // AppKit hooks for wallet connection management
  const { address, isConnected } = useAppKitAccount();

  // Add connection status logging
  React.useEffect(() => {
    if (isConnected && address) {
      console.log("✅ Wallet connected successfully:", {
        address,
        isConnected,
      });
      setConnectionStatus(
        `✅ Connected: ${address.slice(0, 6)}...${address.slice(-4)}`
      );
    } else if (!isConnected) {
      setConnectionStatus("");
    }
  }, [isConnected, address]);

  // Core onramp configuration state
  const [selectedAsset, setSelectedAsset] = useState("USDC"); // Cryptocurrency to purchase
  const [amount, setAmount] = useState("5"); // Fiat amount to spend
  const [selectedNetwork, setSelectedNetwork] = useState("base"); // Blockchain network for delivery (base is compatible with USDC)

  // Add connection status for debugging
  const [connectionStatus, setConnectionStatus] = useState("");

  // UI state management
  const [generatedUrl, setGeneratedUrl] = useState(""); // Generated Coinbase onramp URL
  const [showUrlModal, setShowUrlModal] = useState(false); // Modal visibility state

  // Geographic and compliance settings
  const [selectedCountry, setSelectedCountry] = useState("US"); // User's country
  const [selectedState, setSelectedState] = useState("CA"); // US state (if applicable)

  // Security and session management - always enabled for proper functionality
  const [useSecureInit] = useState(true); // Always enabled - required for valid session tokens
  const [isGeneratingToken, setIsGeneratingToken] = useState(false); // Token generation loading state

  // Payment configuration
  const [selectedPaymentCurrency, setSelectedPaymentCurrency] = useState("USD"); // Fiat currency
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("CARD"); // Payment method

  // Integration mode and wallet handling - simplified to single mode
  const [integrationMode] = useState("API"); // Fixed to API mode only
  const [manualAddress, setManualAddress] = useState(""); // Manual wallet address for guest checkout
  const [useManualAddress, setUseManualAddress] = useState(false); // Guest checkout toggle

  const presetAmounts = ["5", "25", "50"];

  /**
   * @notice Generates a secure session token for enhanced onramp security
   * @dev Calls the server-side API to create JWT tokens using CDP credentials
   * @return Promise<string | null> The generated session token or null if failed
   */
  const generateSessionToken = async () => {
    setIsGeneratingToken(true);
    try {
      const targetAddress = useManualAddress ? manualAddress : address;

      if (!targetAddress) {
        throw new Error("No wallet address available");
      }

      // Validate address format for the selected network
      const validation = validateAddressForNetwork(
        targetAddress,
        selectedNetwork
      );
      if (!validation.isValid) {
        const exampleAddr = getExampleAddress(selectedNetwork);
        const errorMessage = `${validation.error}\n\n${validation.suggestion}${
          exampleAddr
            ? `\n\nExample for ${selectedNetwork}: ${exampleAddr}`
            : ""
        }`;
        alert(errorMessage);
        throw new Error(`Address validation failed: ${validation.error}`);
      }

      // Prepare addresses array with the selected network
      const addresses = [
        {
          address: targetAddress,
          blockchains: [selectedNetwork], // Include the specific network (solana, ethereum, base, etc.)
        },
      ];

      console.log(
        `✅ Address validation passed: ${targetAddress} is valid for ${selectedNetwork} network`
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
    const targetAddress = useManualAddress ? manualAddress : address;

    // Validation: Ensure we have a destination address
    if (!targetAddress && integrationMode === "API") {
      alert(
        "Please connect a wallet or enter a wallet address for guest checkout."
      );
      return;
    }

    if (useManualAddress && !manualAddress) {
      alert("Please enter a valid wallet address for guest checkout.");
      return;
    }

    // Validate address format for the selected network (even without secure init)
    if (targetAddress) {
      const validation = validateAddressForNetwork(
        targetAddress,
        selectedNetwork
      );
      if (!validation.isValid) {
        const exampleAddr = getExampleAddress(selectedNetwork);
        const errorMessage = `${validation.error}\n\n${validation.suggestion}${
          exampleAddr
            ? `\n\nExample for ${selectedNetwork}: ${exampleAddr}`
            : ""
        }`;
        alert(errorMessage);
        return;
      }
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
      asset: selectedAsset,
      amount: amount,
      network: selectedNetwork,
      paymentMethod: selectedPaymentMethod,
      paymentCurrency: selectedPaymentCurrency,
      address: targetAddress,
      redirectUrl: window.location.href,
      sessionToken,
      // enableGuestCheckout, // Removed - not functional
      country: selectedCountry,
      state: selectedState,
    });
    setGeneratedUrl(url);
    setShowUrlModal(true);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    alert("URL copied to clipboard!");
  };

  const handleOpenUrl = () => {
    window.open(generatedUrl, "_blank");
  };

  const getAssetDisplayName = (symbol: string) => {
    const asset = ASSETS.find((a) => a.symbol === symbol);
    return asset ? `${asset.name} (${symbol})` : symbol;
  };

  const getNetworkInfo = (networkId: string) => {
    const network = NETWORKS.find((n) => n.id === networkId);
    return network ? network.name : networkId;
  };

  const selectedPaymentMethodInfo = PAYMENT_METHODS.find(
    (pm) => pm.code === selectedPaymentMethod
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Coinbase Onramp
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"></p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Configure Your Onramp
          </h2>

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

          {/* Country and State Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Object.entries(countryNames).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            {selectedCountry === "US" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {US_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Asset Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Asset
            </label>
            <select
              value={selectedAsset}
              onChange={(e) => {
                const newAsset = e.target.value;
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {ASSETS.map((asset) => {
                const isCompatible =
                  ASSET_NETWORK_MAP[asset.symbol]?.includes(selectedNetwork) ||
                  !ASSET_NETWORK_MAP[asset.symbol];
                return (
                  <option key={asset.symbol} value={asset.symbol}>
                    {asset.name} ({asset.symbol})
                    {!isCompatible
                      ? " - Not available on " + getNetworkInfo(selectedNetwork)
                      : ""}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Network Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Network
            </label>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {NETWORKS.filter(
                (network) =>
                  ASSET_NETWORK_MAP[selectedAsset]?.includes(network.id) ||
                  !ASSET_NETWORK_MAP[selectedAsset] // Show all networks if no mapping exists
              ).map((network) => (
                <option key={network.id} value={network.id}>
                  {network.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {selectedAsset} is available on{" "}
              {ASSET_NETWORK_MAP[selectedAsset]?.length || NETWORKS.length}{" "}
              network
              {(ASSET_NETWORK_MAP[selectedAsset]?.length || NETWORKS.length) > 1
                ? "s"
                : ""}
            </p>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Amount
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    amount === preset
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 px-3 py-3 mb-2">
              <span className="text-gray-500 dark:text-gray-400 text-base font-medium mr-2">
                $
              </span>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                className="w-full bg-transparent outline-none border-none text-gray-900 dark:text-white text-base"
                placeholder="0"
              />
            </div>
          </div>

          {/* Payment Currency */}
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

          {/* Payment Method */}
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

          {/* Guest Checkout Address Option */}
          <div className="mb-6">
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

            {useManualAddress && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination Wallet Address
                </label>
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder={`${getExampleAddress(
                    selectedNetwork
                  )} (${selectedNetwork} address)`}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm ${
                    manualAddress &&
                    !validateAddressForNetwork(manualAddress, selectedNetwork)
                      .isValid
                      ? "border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500"
                  }`}
                />
                {manualAddress &&
                  !validateAddressForNetwork(manualAddress, selectedNetwork)
                    .isValid && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      ❌ Invalid address format for {selectedNetwork} network.
                      Expected:{" "}
                      {
                        validateAddressForNetwork(
                          manualAddress,
                          selectedNetwork
                        ).suggestion
                      }
                    </p>
                  )}
                {manualAddress &&
                  validateAddressForNetwork(manualAddress, selectedNetwork)
                    .isValid && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✅ Valid {selectedNetwork} address
                    </p>
                  )}
                {!manualAddress && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter a {selectedNetwork} wallet address where you want to
                    receive the crypto
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Security Status - Always Enabled */}
          <div className="mb-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Secure Session Tokens Enabled
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Enhanced security with CDP session tokens for all
                    transactions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleOnramp}
            disabled={isGeneratingToken}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center shadow-lg"
          >
            {isGeneratingToken ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              "Buy Crypto Now"
            )}
          </button>
        </div>

        {/* Right Column - Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Preview
          </h2>

          {/* Wallet Connection Section */}
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

          {/* Guest Checkout Info */}
          {useManualAddress && (
            <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-orange-600 dark:text-orange-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
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
            </div>
          )}

          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div
                className={`inline-block font-medium py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg mb-4 cursor-pointer ${
                  isConnected || useManualAddress
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
                onClick={
                  isConnected || useManualAddress
                    ? handleBuyWithCoinbase
                    : () => alert("Please connect your wallet first")
                }
              >
                Buy with Coinbase
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm"></p>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Transaction Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Amount:
                </span>
                <span className="text-gray-900 dark:text-white">
                  ${amount} {selectedPaymentCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Asset:</span>
                <span className="text-gray-900 dark:text-white">
                  {getAssetDisplayName(selectedAsset)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Network:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {getNetworkInfo(selectedNetwork)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Payment:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {selectedPaymentMethodInfo?.name}
                </span>
              </div>
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
                    : address
                    ? `${address.slice(0, 6)}...${address.slice(-4)}`
                    : "Connect wallet"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Mode:</span>
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
            <button
              onClick={handleOnramp}
              disabled={
                isGeneratingToken ||
                (useManualAddress && !manualAddress) ||
                (!useManualAddress && !isConnected && integrationMode === "API")
              }
              className={`w-full font-medium py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl border-2 ${
                isGeneratingToken ||
                (useManualAddress && !manualAddress) ||
                (!useManualAddress && !isConnected && integrationMode === "API")
                  ? "bg-gray-400 cursor-not-allowed border-gray-300"
                  : "bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
              }`}
              style={{
                minHeight: "48px",
                fontSize: "16px",
                fontWeight: "600",
                display: "block",
                visibility: "visible",
                opacity: 1,
                zIndex: 10,
                color: "black",
                backgroundColor:
                  isGeneratingToken ||
                  (useManualAddress && !manualAddress) ||
                  (!useManualAddress &&
                    !isConnected &&
                    integrationMode === "API")
                    ? "lightgray"
                    : "lightblue",
              }}
            >
              {isGeneratingToken
                ? "🔄 Generating Session Token..."
                : integrationMode === "LINK"
                ? "🔗 Generate Payment URL"
                : "💰 Buy Crypto Now"}
            </button>

            {/* Status Message */}
            {useManualAddress && !manualAddress && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 text-center">
                Please enter a wallet address above to continue
              </p>
            )}
            {!useManualAddress && !isConnected && integrationMode === "API" && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 text-center">
                Please connect a wallet above to continue
              </p>
            )}
          </div>
        </div>
      </div>

      {showUrlModal && (
        <GeneratedLinkModal
          title={`${
            useManualAddress
              ? "Guest Checkout"
              : integrationMode === "API"
              ? "Onramp API"
              : "One-time Payment"
          } URL Generated`}
          url={generatedUrl}
          onClose={() => setShowUrlModal(false)}
          onCopy={handleCopyUrl}
          onOpen={handleOpenUrl}
        />
      )}
    </div>
  );
}
