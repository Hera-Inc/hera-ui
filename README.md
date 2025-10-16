# Hera UI - Digital Inheritance Platform

A Next.js web application for managing digital inheritance on the blockchain. Built with Web3Auth for seamless authentication and deployed on Base Sepolia.

## Features

- 🔐 **Web3Auth Integration** - Easy social login for blockchain
- 📝 **Digital Will Management** - Create and manage your digital will
- 💰 **Multi-Asset Support** - ETH, ERC20, and ERC721 tokens
- 👥 **Beneficiary Management** - Add and approve beneficiaries
- ⏰ **Heartbeat System** - Regular check-ins to ensure account activity
- 🎨 **Modern UI** - Beautiful dark mode interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Web3Auth Client ID ([Get one here](https://dashboard.web3auth.io/))

### Environment Setup

1. Copy the environment variables template:

   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your values:
   ```env
   NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_client_id
   NEXT_PUBLIC_WILL_CONTRACT_ADDRESS=0x68eCEac93e1d8AB3c9082D1d7b4f7A768200F129
   ```

### Development

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Web3 Auth**: Web3Auth Modal SDK
- **Blockchain**: Base Sepolia (Ethereum L2)
- **Smart Contracts**: Viem for contract interactions
- **Linting**: Biome
- **Build Tool**: Turbopack (Next.js 15)

## Smart Contract

The UI interacts with the DigitalWillFactory smart contract deployed on Base Sepolia:

- Contract Address: `0x68eCEac93e1d8AB3c9082D1d7b4f7A768200F129`
- Network: Base Sepolia (Chain ID: 84532)
- Explorer: [View on BaseScan](https://sepolia.basescan.org/address/0x68eCEac93e1d8AB3c9082D1d7b4f7A768200F129)

## License

This project is part of Hera Inc - Digital Inheritance Protocol.
