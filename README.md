# Coinbase Onramp Integration

A Next.js application demonstrating secure integration with Coinbase's Onramp service, allowing users to purchase cryptocurrency with fiat currency through multiple wallet connection options and guest checkout functionality.

## 🚀 Features

- **Multi-Wallet Support**: Connect with Coinbase Wallet, MetaMask, and WalletConnect
- **Guest Checkout**: Buy crypto without wallet connection (up to $500/week)
- **Secure Session Tokens**: Server-side JWT generation for enhanced security
- **Responsive Design**: Modern UI that works across all devices
- **Real-time Price Fetching**: Live cryptocurrency prices via CoinGecko API
- **Smart Header**: Auto-hide header on scroll for better UX
- **Multiple Payment Methods**: Card, ACH, Apple Pay, Google Pay, and more
- **Global Support**: Multiple countries, currencies, and payment options

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Wagmi + Viem for Web3 functionality
- **UI Components**: OnchainKit by Coinbase
- **Authentication**: Privy for wallet connections
- **API Integration**: Coinbase Developer Platform (CDP)

## 📋 Prerequisites

- Node.js 18+ and npm
- Coinbase Developer Platform account
- WalletConnect/Reown project (for multi-wallet support)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/meet-metakeep/on-ramp
   cd on-ramp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your environment variables** (see Environment Setup section)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Setup

### Required API Keys

#### 1. Coinbase Developer Platform (CDP)
- Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
- Create a new project
- Generate API credentials
- Copy your Project ID, API Key Name, and Private Key

#### 2. OnchainKit API Key
- From the same CDP dashboard
- Navigate to OnchainKit section
- Generate an API key for client-side usage

#### 3. WalletConnect Project ID
- Visit [Reown (formerly WalletConnect)](https://cloud.reown.com/)
- Create a new project
- Copy your Project ID

### Environment Variables

```env
# Coinbase Developer Platform
NEXT_PUBLIC_CDP_PROJECT_ID="your_cdp_project_id"
CDP_PROJECT_ID="your_cdp_project_id"

# OnchainKit API Keys
NEXT_PUBLIC_ONCHAINKIT_API_KEY="your_onchainkit_api_key"
ONCHAINKIT_API_KEY="your_onchainkit_api_key"

# CDP Session Token Generation
KEY_NAME="your_cdp_api_key_name"
KEY_SECRET="your_cdp_private_key"

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_walletconnect_project_id"
```

## 🏗 Project Structure

```
onrampp/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── session/
│   │   │       └── route.ts          # Session token generation API
│   │   ├── components/
│   │   │   ├── Header.tsx            # Smart header with scroll behavior
│   │   │   ├── OnrampFeature.tsx     # Main onramp component
│   │   │   └── GeneratedLinkModal.tsx # URL display modal
│   │   ├── utils/
│   │   │   ├── onrampApi.ts          # Country names mapping
│   │   │   └── rampUtils.ts          # URL generation utilities
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Main page
│   │   ├── providers.tsx             # Context providers
│   │   └── globals.css               # Global styles
├── public/                           # Static assets
├── .env.example                      # Environment variables template
├── .env.local                        # Your environment variables (gitignored)
├── package.json                      # Dependencies and scripts
└── README.md                         # This file
```

## 🔑 Key Components

### OnrampFeature
The main component handling the onramp flow:
- User input collection (amount, asset, network, payment method)
- Wallet connection management
- Guest checkout functionality
- Session token generation
- URL generation and modal display

### Header
Smart header component with:
- Auto-hide on scroll down
- Show on scroll up
- Wallet connection status
- Responsive design

### GeneratedLinkModal
Clean modal component for displaying generated onramp URLs:
- URL display with truncation for long URLs
- Copy to clipboard functionality
- Direct link opening
- Responsive design

### API Routes
- `/api/session` - Generates secure session tokens using CDP SDK

### Utilities
- `rampUtils.ts` - URL generation with session token support
- `onrampApi.ts` - Country names mapping for location selection

## 🛡 Security Features

### Session Tokens
- **Server-side generation**: API credentials never exposed to client
- **Short-lived tokens**: Enhanced security for transactions
- **JWT-based**: Industry standard token format
- **Coinbase recommended**: Required for production applications

### Environment Security
- **Separate client/server vars**: Clear separation of public/private data
- **Gitignored credentials**: `.env.local` never committed
- **Type-safe configuration**: TypeScript interfaces for environment variables

## 🌍 Supported Features

### Cryptocurrencies
- USDC, ETH, BTC, SOL, MATIC, AVAX, LINK, UNI, AAVE, DAI

### Networks
- Base, Ethereum, Optimism, Arbitrum, Polygon, Avalanche, Solana, BNB Chain

### Payment Methods
- Debit/Credit Card, ACH Bank Transfer, Apple Pay, Google Pay, SEPA, iDEAL, SOFORT

### Countries
- US, UK, Canada, Australia, Germany, France, Spain, Italy, Netherlands, Switzerland, Singapore, Japan

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fonrampp)

### Environment Variables for Production
Ensure all environment variables from `.env.example` are set in your production environment.

## 🐛 Troubleshooting

### Common Issues

1. **Session Token Generation Fails**
   - Verify CDP API credentials are correct
   - Check that KEY_NAME and KEY_SECRET are properly set
   - Ensure CDP project is active

2. **Wallet Connection Issues**
   - Verify WalletConnect Project ID is correct
   - Try disconnecting and reconnecting wallet
   - Check browser console for errors

3. **Modal Not Displaying**
   - Check browser console for JavaScript errors
   - Verify all required environment variables are set
   - Try refreshing the page

### Debug Mode
Set `NODE_ENV=development` to enable detailed logging and error messages.

## 📝 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Standard configuration
- **Prettier**: Automatic code formatting
- **NatSpec**: Comprehensive function documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
- [OnchainKit Documentation](https://onchainkit.xyz/)
- [WalletConnect/Reown](https://cloud.reown.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)

## 💡 Support

For support and questions:
- Check the [troubleshooting section](#-troubleshooting)
- Review [Coinbase Developer Docs](https://docs.cdp.coinbase.com/)
- Open an issue in this repository

---

**Note**: This is a demonstration application. For production use, ensure proper security reviews and compliance with local regulations.
