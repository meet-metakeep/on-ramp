/**
 * @title Coinbase Onramp URL Generation Utilities
 * @notice Provides functions for generating secure Coinbase onramp URLs
 * @dev Supports both session token and legacy integration modes
 * @author Meet - Coinbase Onramp Integration Demo
 */

/**
 * @dev Configuration interface for onramp URL generation
 * @param asset Cryptocurrency symbol (e.g., "USDC", "ETH")
 * @param amount Fiat amount to spend
 * @param network Blockchain network identifier
 * @param paymentMethod Payment method code (e.g., "CARD", "ACH")
 * @param paymentCurrency Optional fiat currency code (default: "USD")
 * @param address Optional destination wallet address
 * @param redirectUrl URL to redirect after transaction completion
 * @param sessionToken Optional secure session token for enhanced security
 * @param enableGuestCheckout Optional guest checkout enablement
 * @param country Optional country code for compliance
 * @param state Optional state code for US users
 */
interface OnrampURLParams {
  asset: string;
  amount: string;
  network: string;
  paymentMethod: string;
  paymentCurrency?: string;
  address?: string;
  redirectUrl: string;
  sessionToken?: string;
  enableGuestCheckout?: boolean;
  country?: string;
  state?: string;
}

/**
 * @dev Coinbase Developer Platform Project ID - hardcoded for this demo
 * @notice In production, this should be stored as an environment variable
 */
const CDP_PROJECT_ID = '75964b10-8e1e-4941-8c9d-d66697267c71';

/**
 * @notice Generates a complete Coinbase Onramp URL with the provided parameters
 * @dev Supports both secure session token mode and legacy integration mode
 * @param params OnrampURLParams configuration object
 * @return string Complete URL for Coinbase onramp flow
 * @custom:security Session tokens provide enhanced security by keeping credentials server-side
 */
export function generateOnrampURL(params: OnrampURLParams): string {
  const {
    asset,
    amount,
    network,
    paymentMethod,
    paymentCurrency,
    address,
    redirectUrl,
    sessionToken,
    enableGuestCheckout,
    country,
    state,
  } = params;

  // Validate and parse amount to a number for presetFiatAmount
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) {
    throw new Error("Invalid amount provided");
  }

  // Base URL for Coinbase Onramp service
  const baseUrl = "https://pay.coinbase.com/buy/select-asset";

  // Build query parameters
  const queryParams = new URLSearchParams();

  // If using session token, only include sessionToken and optional UI params
  if (sessionToken) {
    queryParams.append("sessionToken", sessionToken);
    
    // Optional UI parameters can still be used with session token
    if (asset) queryParams.append("defaultAsset", asset);
    if (network) queryParams.append("defaultNetwork", network);
    if (paymentMethod) {
      const formattedPaymentMethod = paymentMethod.toUpperCase();
      queryParams.append("defaultPaymentMethod", formattedPaymentMethod);
    }
    if (numericAmount > 0) {
      queryParams.append("presetFiatAmount", numericAmount.toString());
    }
    if (paymentCurrency) {
      queryParams.append("fiatCurrency", paymentCurrency);
    }
    if (address) {
      queryParams.append("partnerUserId", address.substring(0, 49));
    }
    if (country) {
      queryParams.append("country", country);
    }
    if (state) {
      queryParams.append("subdivision", state);
    }
    if (redirectUrl) {
      queryParams.append("redirectUrl", redirectUrl);
    }
  } else {
    // Traditional flow without session token
    queryParams.append("appId", CDP_PROJECT_ID);

    // Format addresses as a JSON string: {"address":["network"]}
    if (address) {
      const addressesObj: Record<string, string[]> = {};
      addressesObj[address] = [network];
      queryParams.append("addresses", JSON.stringify(addressesObj));
    }

    // Assets parameter
    if (asset) {
      queryParams.append("assets", JSON.stringify([asset]));
      queryParams.append("defaultAsset", asset);
    }

    if (network) queryParams.append("defaultNetwork", network);

    // Format payment method properly
    if (paymentMethod) {
      const formattedPaymentMethod = paymentMethod.toUpperCase();
      queryParams.append("defaultPaymentMethod", formattedPaymentMethod);
    }

    // Add fiat amount and currency
    if (numericAmount > 0) {
      queryParams.append("presetFiatAmount", numericAmount.toString());
    }

    if (paymentCurrency) {
      queryParams.append("fiatCurrency", paymentCurrency);
    }

    // Add partner user ID
    if (address) {
      queryParams.append("partnerUserId", address.substring(0, 49));
    }

    // Add redirect URL
    if (redirectUrl) {
      queryParams.append("redirectUrl", redirectUrl);
    } else {
      queryParams.append("redirectUrl", "http://localhost:3000");
    }

    // Add guest checkout parameter if provided
    if (enableGuestCheckout !== undefined) {
      queryParams.append("enableGuestCheckout", enableGuestCheckout.toString());
    }
  }

  // Return the complete URL
  return `${baseUrl}?${queryParams.toString()}`;
} 