/**
 * @title Session Token API Route
 * @notice Secure server-side session token generation for Coinbase Onramp
 * @dev Uses Coinbase Developer Platform (CDP) SDK to generate JWT tokens
 * @author Meet - Coinbase Onramp Integration Demo
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateJwt } from '@coinbase/cdp-sdk/auth';

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

    // Handle backward compatibility with walletAddress
    let finalAddresses = addresses;
    if (!addresses && walletAddress) {
      finalAddresses = [{
        address: walletAddress,
        blockchains: ["base", "ethereum"]
      }];
    }

    if (!finalAddresses || finalAddresses.length === 0) {
      return NextResponse.json(
        {
          error: 'Addresses parameter is required',
        },
        { status: 400 }
      );
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

    // Return the session token - CDP API returns data.token
    return NextResponse.json({
      token: data.data?.token || data.token,
      channel_id: data.data?.channel_id || data.channel_id,
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