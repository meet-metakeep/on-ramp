/**
 * @title Address Validation Utilities
 * @notice Validates wallet addresses against their corresponding blockchain networks
 * @dev Prevents invalid address-network combinations that cause CDP API errors
 * @dev Extended to support ALL networks from comprehensive onramp-demo-application mapping
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
    // EVM-compatible networks (0x addresses)
    case 'ethereum':
    case 'base':
    case 'optimism':
    case 'arbitrum':
    case 'polygon':
    case 'avalanche-c-chain':
    case 'binance-smart-chain':
    case 'bnb-chain':
    case 'binance-chain':
    case 'fantom':
    case 'cronos':
    case 'gnosis':
    case 'celo':
    case 'moonbeam':
    case 'harmony':
    case 'unichain':
      // EVM networks use 0x addresses (42 characters)
      return /^0x[a-fA-F0-9]{40}$/.test(normalizedAddress);
    
    // Solana ecosystem
    case 'solana':
      // Solana addresses are base58 encoded (32-44 characters, no 0x prefix)
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(normalizedAddress) && !normalizedAddress.startsWith('0x');
    
    // Bitcoin ecosystem
    case 'bitcoin':
    case 'bitcoin-lightning':
      // Bitcoin addresses can be P2PKH (1...), P2SH (3...), or Bech32 (bc1...)
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(normalizedAddress) || 
             /^bc1[a-z0-9]{39,59}$/.test(normalizedAddress);
    
    // Cardano
    case 'cardano':
      // Cardano addresses start with addr1 (Shelley era)
      return /^addr1[a-z0-9]{98}$/.test(normalizedAddress);
    
    // Polkadot ecosystem
    case 'polkadot':
      // Polkadot addresses are SS58 encoded, typically start with 1
      return /^1[a-zA-Z0-9]{47}$/.test(normalizedAddress);
    
    // Cosmos ecosystem
    case 'cosmos':
      // Cosmos addresses start with "cosmos" prefix
      return /^cosmos1[a-z0-9]{38}$/.test(normalizedAddress);
    
    // NEAR Protocol
    case 'near':
      // NEAR addresses can be account names or hex addresses
      return /^[a-z0-9._-]+\.near$/.test(normalizedAddress) || 
             /^[a-f0-9]{64}$/.test(normalizedAddress);
    
    // Flow
    case 'flow':
      // Flow addresses are 16 characters hex
      return /^0x[a-fA-F0-9]{16}$/.test(normalizedAddress);
    
    // Hedera
    case 'hedera':
      // Hedera addresses are in format 0.0.xxxxx
      return /^0\.0\.\d+$/.test(normalizedAddress);
    
    // Algorand
    case 'algorand':
      // Algorand addresses are 58 characters base32
      return /^[A-Z2-7]{58}$/.test(normalizedAddress);
    
    // Tezos
    case 'tezos':
      // Tezos addresses start with tz1, tz2, tz3, or KT1
      return /^(tz1|tz2|tz3|KT1)[a-zA-Z0-9]{33}$/.test(normalizedAddress);
    
    // Stellar
    case 'stellar':
      // Stellar addresses start with G and are 56 characters
      return /^G[A-Z2-7]{55}$/.test(normalizedAddress);
    
    // TRON
    case 'tron':
      // TRON addresses start with T and are 34 characters
      return /^T[A-Za-z0-9]{33}$/.test(normalizedAddress);
    
    // Filecoin
    case 'filecoin':
      // Filecoin addresses start with f1, f2, f3, or f4
      return /^f[1-4][a-zA-Z0-9]+$/.test(normalizedAddress);
    
    // XRP Ledger
    case 'ripple':
    case 'xrp':
      // XRP addresses are base58 encoded and start with r
      return /^r[a-zA-Z0-9]{25,34}$/.test(normalizedAddress);
    
    // Dogecoin
    case 'dogecoin':
      // Dogecoin addresses start with D
      return /^D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{32}$/.test(normalizedAddress);
    
    // Litecoin
    case 'litecoin':
      // Litecoin addresses start with L or M, or ltc1 for bech32
      return /^[LM][a-km-zA-HJ-NP-Z1-9]{33}$/.test(normalizedAddress) ||
             /^ltc1[a-z0-9]{39,59}$/.test(normalizedAddress);
    
    // Bitcoin Cash
    case 'bitcoin-cash':
      // Bitcoin Cash addresses can be legacy (1 or 3) or CashAddr (bitcoincash:)
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(normalizedAddress) ||
             /^bitcoincash:[a-z0-9]{42}$/.test(normalizedAddress);
    
    // Aptos
    case 'aptos':
      // Aptos addresses are 64-character hex strings with 0x prefix
      return /^0x[a-fA-F0-9]{64}$/.test(normalizedAddress);
    
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
    // EVM Networks
    case 'ethereum':
    case 'base':
    case 'optimism':
    case 'arbitrum':
    case 'polygon':
    case 'avalanche-c-chain':
    case 'binance-smart-chain':
    case 'bnb-chain':
    case 'binance-chain':
    case 'fantom':
    case 'cronos':
    case 'gnosis':
    case 'celo':
    case 'moonbeam':
    case 'harmony':
    case 'unichain':
      return 'Ethereum-style address (0x followed by 40 hexadecimal characters)';
    
    case 'solana':
      return 'Solana address (32-44 base58 characters, no 0x prefix)';
    
    case 'bitcoin':
    case 'bitcoin-lightning':
      return 'Bitcoin address (starts with 1, 3, or bc1)';
    
    case 'cardano':
      return 'Cardano address (starts with addr1)';
    
    case 'polkadot':
      return 'Polkadot address (SS58 format, typically starts with 1)';
    
    case 'cosmos':
      return 'Cosmos address (starts with cosmos1)';
    
    case 'near':
      return 'NEAR address (account.near or 64-character hex)';
    
    case 'flow':
      return 'Flow address (0x followed by 16 hex characters)';
    
    case 'hedera':
      return 'Hedera address (format: 0.0.xxxxx)';
    
    case 'algorand':
      return 'Algorand address (58-character base32)';
    
    case 'tezos':
      return 'Tezos address (starts with tz1, tz2, tz3, or KT1)';
    
    case 'stellar':
      return 'Stellar address (starts with G, 56 characters)';
    
    case 'tron':
      return 'TRON address (starts with T, 34 characters)';
    
    case 'filecoin':
      return 'Filecoin address (starts with f1, f2, f3, or f4)';
    
    case 'ripple':
    case 'xrp':
      return 'XRP address (starts with r)';
    
    case 'dogecoin':
      return 'Dogecoin address (starts with D)';
    
    case 'litecoin':
      return 'Litecoin address (starts with L, M, or ltc1)';
    
    case 'bitcoin-cash':
      return 'Bitcoin Cash address (legacy or CashAddr format)';
    
    case 'aptos':
      return 'Aptos address (0x followed by 64 hex characters)';
    
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
    // EVM Networks
    case 'ethereum':
    case 'base':
    case 'optimism':
    case 'arbitrum':
    case 'polygon':
    case 'avalanche-c-chain':
    case 'binance-smart-chain':
    case 'bnb-chain':
    case 'binance-chain':
    case 'fantom':
    case 'cronos':
    case 'gnosis':
    case 'celo':
    case 'moonbeam':
    case 'harmony':
    case 'unichain':
      return '0x742d35Cc6634C0532925a3b8D96cF1B8FdB1f3b4';
    
    case 'solana':
      return '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
    
    case 'bitcoin':
    case 'bitcoin-lightning':
      return '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    
    case 'cardano':
      return 'addr1qxy48xrv7vve0q5xt0k5rh5qvxlkm5qe8d9klphrxsmhpqhxvmm5xvmr8uqn8qrxymqvxq7qrqxnqvx';
    
    case 'polkadot':
      return '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB';
    
    case 'cosmos':
      return 'cosmos1depk54cuajgkzea6zpgkq36tnjwdzv4afc3d27';
    
    case 'near':
      return 'alice.near';
    
    case 'flow':
      return '0x1d007d755706c469';
    
    case 'hedera':
      return '0.0.123456';
    
    case 'algorand':
      return 'DPLD3RY7DDPQJ7C4XVXIYD5K5MZTVQNHQK5LZCCQXHCQWXEQZYPZXQHGZM';
    
    case 'tezos':
      return 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb';
    
    case 'stellar':
      return 'GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU';
    
    case 'tron':
      return 'TLPpacjdykQDpyEx7f9uVAsaJSQweBcLkT';
    
    case 'filecoin':
      return 'f1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za';
    
    case 'ripple':
    case 'xrp':
      return 'rLHzPsX6oXkzU2qL12kHCH8G8cnZv1rBJh';
    
    case 'dogecoin':
      return 'D7Y55Lkc462D3xzjrQTyVSiXNezDg';
    
    case 'litecoin':
      return 'LdP8Qox1VAhCzLJNqrr74YovaWYyNSTpQH';
    
    case 'bitcoin-cash':
      return 'bitcoincash:qzm47qz5ue99y9yl4aca7jnz7dwgdenl85jkwmhvhm';
    
    case 'aptos':
      return '0x1ac46c4b1c56de0e06fad8b2c9e6b8985d1cc5c7b2e4cdcdbc8b0e4e65a7b6b9';
    
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