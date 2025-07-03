/**
 * @title Coinbase Onramp URL Generation Utilities
 * @notice Provides functions for generating secure Coinbase onramp URLs using session tokens
 * @dev Uses Coinbase's mandatory Secure Init with session tokens
 * @author Meet - Coinbase Onramp Integration Demo
 */

/**
 * @dev Configuration interface for onramp URL generation - EXPERIMENT: Session Token Only
 * @param sessionToken Secure session token for authentication (required)
 */
interface OnrampURLParams {
  sessionToken: string;
  // COMMENTED OUT FOR EXPERIMENT - Session token only
  // asset?: string;
  // amount?: string;
  // network?: string;
  // paymentMethod?: string;
  // paymentCurrency?: string;
  // address?: string;
  // redirectUrl?: string;
  // country?: string;
  // state?: string;
}



/**
 * @notice Generates a complete Coinbase Onramp URL with session token
 * @dev Uses Coinbase's mandatory Secure Init approach with session tokens
 * @param params OnrampURLParams configuration object
 * @return string Complete URL for Coinbase onramp flow
 * @custom:security Session tokens provide enhanced security by keeping credentials server-side
 */
export function generateOnrampURL(params: OnrampURLParams): string {
  const {
    sessionToken,
    // COMMENTED OUT FOR EXPERIMENT - Session token only
    // asset,
    // amount,
    // network,
    // paymentMethod,
    // paymentCurrency,
    // address,
    // redirectUrl,
    // country,
    // state,
  } = params;

  if (!sessionToken) {
    throw new Error("Session token is required");
  }

  // Base URL for Coinbase Onramp service
  const baseUrl = "https://pay.coinbase.com/buy/select-asset";

  // Build query parameters
  const queryParams = new URLSearchParams();

  // EXPERIMENT: Only session token - no other parameters
  queryParams.append("sessionToken", sessionToken);

  // COMMENTED OUT FOR EXPERIMENT - All optional UI parameters
  // if (asset) {
  //   queryParams.append("defaultAsset", asset);
  // }
  // 
  // if (network) {
  //   queryParams.append("defaultNetwork", network);
  // }
  // 
  // if (paymentMethod) {
  //   queryParams.append("defaultPaymentMethod", paymentMethod.toUpperCase());
  // }
  // 
  // if (amount) {
  //   const numericAmount = parseFloat(amount);
  //   if (!isNaN(numericAmount) && numericAmount > 0) {
  //     queryParams.append("presetFiatAmount", numericAmount.toString());
  //   }
  // }
  // 
  // if (paymentCurrency) {
  //   queryParams.append("fiatCurrency", paymentCurrency);
  // }
  // 
  // if (address) {
  //   queryParams.append("partnerUserId", address.substring(0, 49));
  // }
  // 
  // if (country) {
  //   queryParams.append("country", country);
  // }
  // 
  // if (state) {
  //   queryParams.append("subdivision", state);
  // }
  // 
  // if (redirectUrl) {
  //   queryParams.append("redirectUrl", redirectUrl);
  // }

  // Return the complete URL - EXPERIMENT: Session token only
  return `${baseUrl}?${queryParams.toString()}`;
} 