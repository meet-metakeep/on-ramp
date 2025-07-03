/**
 * @title Session Token API Route
 * @notice Secure server-side session token generation for Coinbase Onramp
 * @dev Uses Coinbase Developer Platform (CDP) SDK to generate JWT tokens
 * @author Meet - Coinbase Onramp Integration Demo
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateJwt } from '@coinbase/cdp-sdk/auth';
import { validateAddressForNetwork } from '../../utils/addressValidation';

/**
 * @dev Interface for session token request body
 * @param addresses Array of wallet addresses with supported blockchains
 * @param assets Optional array of supported crypto assets
 * @param walletAddress Legacy parameter for backward compatibility
 */
interface SessionTokenRequest {
  addresses: Array<{
    address: string;
    blockchains: string[];
  }>;
  assets?: string[];
  walletAddress?: string; // For backward compatibility
}

/**
 * @notice POST handler for session token generation
 * @dev Validates credentials, generates JWT, and communicates with CDP API
 * @param request NextRequest containing wallet addresses and optional assets
 * @return NextResponse with session token or error details
 */
export async function POST(request: NextRequest) {
  try {
    // Get CDP API credentials from environment variables
    const keyName = process.env.KEY_NAME || process.env.CDP_API_KEY;
    const keySecret = process.env.KEY_SECRET || process.env.CDP_API_SECRET;

    if (!keyName || !keySecret) {
      console.error('Missing CDP API credentials');
      return NextResponse.json(
        {
          error: 'Missing CDP API credentials. Please set KEY_NAME and KEY_SECRET environment variables.',
        },
        { status: 500 }
      );
    }

    console.log('Using CDP SDK for JWT generation');

    // Parse request body
    const body = await request.json();
    const { addresses, assets, walletAddress } = body as SessionTokenRequest;

    console.log('=== Session Token Request Debug ===');
    console.log('Request body:', body);
    console.log('Addresses:', addresses);
    console.log('WalletAddress (legacy):', walletAddress);
    console.log('Assets:', assets);
    console.log('====================================');

    // Handle backward compatibility with walletAddress
    const finalAddresses = addresses;
    if (!addresses && walletAddress) {
      console.error('ERROR: Legacy walletAddress parameter used without network specification!');
      console.error('This will cause issues with non-Ethereum addresses like Solana.');
      console.error('Please update frontend to use addresses array with blockchain specification.');
      return NextResponse.json(
        {
          error: 'Legacy walletAddress parameter is no longer supported. Please use addresses array with blockchain specification.',
          details: 'Update your frontend to send: {"addresses": [{"address": "...", "blockchains": ["solana"]}]} instead of {"walletAddress": "..."}'
        },
        { status: 400 }
      );
    }

    if (!finalAddresses || finalAddresses.length === 0) {
      return NextResponse.json(
        {
          error: 'Addresses parameter is required. Format: {"addresses": [{"address": "...", "blockchains": ["network"]}]}',
        },
        { status: 400 }
      );
    }

    // Validate each address against its specified blockchains
    for (const addressEntry of finalAddresses) {
      const { address, blockchains } = addressEntry;
      
      if (!address || !blockchains || blockchains.length === 0) {
        return NextResponse.json(
          {
            error: 'Each address entry must have an address and at least one blockchain',
            details: `Invalid entry: ${JSON.stringify(addressEntry)}`,
          },
          { status: 400 }
        );
      }

      // Validate the address format for each blockchain
      for (const blockchain of blockchains) {
        const validation = validateAddressForNetwork(address, blockchain);
        if (!validation.isValid) {
          console.error(`Address validation failed: ${address} is not valid for ${blockchain}`);
          console.error(`Validation error: ${validation.error}`);
          console.error(`Suggestion: ${validation.suggestion}`);
          
          return NextResponse.json(
            {
              error: 'Invalid address format for specified blockchain',
              details: {
                address,
                blockchain,
                reason: validation.error,
                suggestion: validation.suggestion,
              },
            },
            { status: 400 }
          );
        }
      }
      
      console.log(`Server-side validation passed: ${address} is valid for ${blockchains.join(', ')}`);
    }

    // Generate JWT using CDP SDK
    let jwtToken: string;
    try {
      jwtToken = await generateJwt({
        apiKeyId: keyName,
        apiKeySecret: keySecret,
        requestMethod: 'POST',
        requestHost: 'api.developer.coinbase.com',
        requestPath: '/onramp/v1/token',
        expiresIn: 120 // 2 minutes as per CDP documentation
      });
      console.log('JWT generated successfully using CDP SDK');
      
      // Log the generated JWT token details
      console.log('=== CDP SDK Generated JWT Debug Info ===');
      console.log('Full JWT Token:', jwtToken);
      console.log('JWT Token Length:', jwtToken.length);
      
      // Decode and log JWT parts
      const parts = jwtToken.split('.');
      console.log('JWT Parts:');
      console.log('  Header (base64):', parts[0]);
      console.log('  Payload (base64):', parts[1]);
      console.log('  Signature (base64):', parts[2]);
      
      // Decode header and payload for visibility
      try {
        const decodedHeader = JSON.parse(Buffer.from(parts[0], 'base64').toString());
        const decodedPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        console.log('  Decoded Header:', decodedHeader);
        console.log('  Decoded Payload:', decodedPayload);
        console.log('  Token expiration time:', new Date(decodedPayload.exp * 1000).toISOString());
             } catch {
         console.log('  Could not decode JWT parts for display');
       }
      console.log('=======================================');
    } catch (error) {
      console.error('JWT generation failed:', error);
      return NextResponse.json(
        {
          error: 'Failed to generate JWT token',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

    // Prepare request to Coinbase API
    const cdpApiUrl = 'https://api.developer.coinbase.com/onramp/v1/token';
    
    const requestBody = {
      addresses: finalAddresses,
      ...(assets && { assets }),
    };

    console.log('Making request to CDP API:', {
      url: cdpApiUrl,
      addressCount: finalAddresses.length,
      hasAssets: !!assets,
      addresses: finalAddresses, // Log the actual addresses being sent
    });

    // Make request to Coinbase API
    const response = await fetch(cdpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('CDP API error:', response.status, response.statusText);
      console.error('Response body:', responseText);
      
      // Try to parse error as JSON
      let errorDetails;
      try {
        errorDetails = JSON.parse(responseText);
      } catch {
        errorDetails = responseText;
      }
      
      // Provide helpful error messages based on status code
      if (response.status === 401) {
        return NextResponse.json(
          {
            error: 'Authentication failed',
            details: 'Please verify your CDP API key and secret are correct.',
            apiError: errorDetails
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        {
          error: `CDP API error: ${response.status} ${response.statusText}`,
          details: errorDetails,
        },
        { status: response.status }
      );
    }

    // Parse successful response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response:', responseText, parseError);
      return NextResponse.json(
        {
          error: 'Invalid response from CDP API',
          details: responseText,
        },
        { status: 500 }
      );
    }

    console.log('Successfully generated session token');
    
    // Log session token details
    console.log('=== Session Token Debug Info ===');
    console.log('Raw CDP API Response:', responseText);
    console.log('Parsed Session Data:', data);
    
    const sessionToken = data.data?.token || data.token;
    const channelId = data.data?.channel_id || data.channel_id;
    
    console.log('Session Token:', sessionToken);
    console.log('Channel ID:', channelId);
    console.log('Session Token Length:', sessionToken ? sessionToken.length : 'N/A');
    
    // Try to decode session token if it's JWT format
    if (sessionToken && sessionToken.includes('.')) {
      try {
        const tokenParts = sessionToken.split('.');
        console.log('Session Token Parts:');
        console.log('  Header (base64):', tokenParts[0]);
        console.log('  Payload (base64):', tokenParts[1]);
        if (tokenParts[2]) console.log('  Signature (base64):', tokenParts[2]);
        
        // Decode header and payload
        const decodedHeader = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString());
        const decodedPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('  Decoded Header:', decodedHeader);
        console.log('  Decoded Payload:', decodedPayload);
        if (decodedPayload.exp) {
          console.log('  Token expiration time:', new Date(decodedPayload.exp * 1000).toISOString());
        }
             } catch {
         console.log('Session token is not JWT format or could not be decoded');
       }
    }
    console.log('===============================');

    // Return the session token - CDP API returns data.token
    return NextResponse.json({
      token: sessionToken,
      channel_id: channelId,
    });
  } catch (error) {
    console.error('Error generating session token:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate session token',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 