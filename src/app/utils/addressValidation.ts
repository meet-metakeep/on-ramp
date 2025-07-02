/**
 * @title Address Validation Utilities
 * @notice Validates wallet addresses against their corresponding blockchain networks
 * @dev Prevents invalid address-network combinations that cause CDP API errors
 */

/**
 * @dev Validates if an address format matches the expected format for a given blockchain
 * @param address The wallet address to validate
 * @param network The blockchain network identifier
 * @returns boolean indicating if the address is valid for the network
 */
export function isAddressValidForNetwork(address: string, network: string): boolean {
  if (!address || !network) {
    return false;
  }

  // Normalize the address
  const normalizedAddress = address.trim();

  switch (network.toLowerCase()) {
    case 'ethereum':
    case 'base':
    case 'optimism':
    case 'arbitrum':
    case 'polygon':
    case 'avalanche-c-chain':
      // EVM networks use 0x addresses (42 characters)
      return /^0x[a-fA-F0-9]{40}$/.test(normalizedAddress);
    
    case 'solana':
      // Solana addresses are base58 encoded (32-44 characters, no 0x prefix)
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(normalizedAddress) && !normalizedAddress.startsWith('0x');
    
    case 'bitcoin':
      // Bitcoin addresses can be P2PKH (1...), P2SH (3...), or Bech32 (bc1...)
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(normalizedAddress) || 
             /^bc1[a-z0-9]{39,59}$/.test(normalizedAddress);
    
    default:
      // For unknown networks, don't validate (allow through)
      console.warn(`Unknown network for validation: ${network}`);
      return true;
  }
}

/**
 * @dev Gets the expected address format description for a network
 * @param network The blockchain network identifier
 * @returns string describing the expected address format
 */
export function getAddressFormatDescription(network: string): string {
  switch (network.toLowerCase()) {
    case 'ethereum':
    case 'base':
    case 'optimism':
    case 'arbitrum':
    case 'polygon':
    case 'avalanche-c-chain':
      return 'Ethereum-style address (0x followed by 40 hexadecimal characters)';
    
    case 'solana':
      return 'Solana address (32-44 base58 characters, no 0x prefix)';
    
    case 'bitcoin':
      return 'Bitcoin address (starts with 1, 3, or bc1)';
    
    default:
      return 'Valid address for the selected network';
  }
}

/**
 * @dev Gets example addresses for a given network
 * @param network The blockchain network identifier
 * @returns string with example address format
 */
export function getExampleAddress(network: string): string {
  switch (network.toLowerCase()) {
    case 'ethereum':
    case 'base':
    case 'optimism':
    case 'arbitrum':
    case 'polygon':
    case 'avalanche-c-chain':
      return '0x742d35Cc6634C0532925a3b8D96cF1B8FdB1f3b4';
    
    case 'solana':
      return '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
    
    case 'bitcoin':
      return '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    
    default:
      return '';
  }
}

/**
 * @dev Validates an address and returns detailed error information
 * @param address The wallet address to validate
 * @param network The blockchain network identifier
 * @returns object with validation result and error details if invalid
 */
export function validateAddressForNetwork(address: string, network: string): {
  isValid: boolean;
  error?: string;
  suggestion?: string;
} {
  if (!address) {
    return {
      isValid: false,
      error: 'Address is required',
    };
  }

  if (!network) {
    return {
      isValid: false,
      error: 'Network is required',
    };
  }

  const isValid = isAddressValidForNetwork(address, network);
  
  if (!isValid) {
    const formatDescription = getAddressFormatDescription(network);
    const example = getExampleAddress(network);
    
    return {
      isValid: false,
      error: `Invalid address format for ${network} network`,
      suggestion: `Expected: ${formatDescription}${example ? `\nExample: ${example}` : ''}`,
    };
  }

  return { isValid: true };
} 